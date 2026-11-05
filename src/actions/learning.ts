'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function completeLesson(lessonId: string, timeSpentSeconds: number = 60) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  // 1. Upsert lesson progress
  const { error: progressError } = await supabase
    .from('lesson_progress')
    .upsert(
      {
        student_id: user.id,
        lesson_id: lessonId,
        status: 'completed',
        completed_at: new Date().toISOString(),
        time_spent_seconds: timeSpentSeconds,
      },
      { onConflict: 'student_id,lesson_id' }
    )

  if (progressError) {
    throw new Error(`Failed to update progress: ${progressError.message}`)
  }

  // 2. Log activity
  await supabase.from('learning_activities').insert({
    student_id: user.id,
    activity_type: 'lesson_complete',
    resource_id: lessonId,
    resource_type: 'lesson',
    metadata: { timeSpentSeconds },
  })

  // 3. Recalculate course progress
  // Find course for this lesson
  const { data: lesson } = await supabase
    .from('lessons')
    .select('parts(modules(course_id))')
    .eq('id', lessonId)
    .single()

  const courseId = (lesson?.parts as unknown as { modules: { course_id: string } })?.modules?.course_id

  if (courseId) {
    // Total published lessons in course
    const { count: totalLessons } = await supabase
      .from('lessons')
      .select('id, parts!inner(modules!inner(course_id))', { count: 'exact', head: true })
      .eq('parts.modules.course_id', courseId)
      .eq('is_published', true)

    // Completed lessons by this user
    const { count: completedCount } = await supabase
      .from('lesson_progress')
      .select('id, lessons!inner(parts!inner(modules!inner(course_id)))', { count: 'exact', head: true })
      .eq('lessons.parts.modules.course_id', courseId)
      .eq('student_id', user.id)
      .eq('status', 'completed')

    if (totalLessons && totalLessons > 0) {
      const percentage = Math.min(100, Math.round(((completedCount || 0) / totalLessons) * 100))
      await supabase
        .from('enrollments')
        .upsert(
          {
            student_id: user.id,
            course_id: courseId,
            progress_percentage: percentage,
            status: percentage === 100 ? 'completed' : 'active',
            completed_at: percentage === 100 ? new Date().toISOString() : null,
          },
          { onConflict: 'student_id,course_id' }
        )
    }
  }

  revalidatePath('/dashboard')
  revalidatePath('/roadmap')
  revalidatePath('/learn')
  return { success: true }
}

export async function submitQuizAttempt(
  quizId: string,
  answers: Record<string, string>,
  timeSpentSeconds: number
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  // 1. Fetch questions to score server-side (never trust client score)
  const { data: questions, error: qError } = await supabase
    .from('quiz_questions')
    .select('id, correct_answer, points')
    .eq('quiz_id', quizId)

  if (qError || !questions) {
    throw new Error('Failed to load quiz questions')
  }

  let totalPoints = 0
  let earnedScore = 0

  for (const q of questions) {
    const points = q.points || 1
    totalPoints += points
    if (answers[q.id]?.toUpperCase() === q.correct_answer.toUpperCase()) {
      earnedScore += points
    }
  }

  const percentage = totalPoints > 0 ? (earnedScore / totalPoints) * 100 : 0

  // 2. Fetch quiz passing score requirement
  const { data: quiz } = await supabase
    .from('quizzes')
    .select('passing_score')
    .eq('id', quizId)
    .single()

  const passingScore = quiz?.passing_score || 70
  const passed = percentage >= passingScore

  // 3. Insert quiz attempt
  const { data: attempt, error: insertError } = await supabase
    .from('quiz_attempts')
    .insert({
      quiz_id: quizId,
      student_id: user.id,
      score: earnedScore,
      total_points: totalPoints,
      percentage: Math.round(percentage * 100) / 100,
      passed,
      answers,
      completed_at: new Date().toISOString(),
      time_spent_seconds: timeSpentSeconds,
    })
    .select()
    .single()

  if (insertError) {
    throw new Error(`Failed to record attempt: ${insertError.message}`)
  }

  // 4. Record learning activity
  await supabase.from('learning_activities').insert({
    student_id: user.id,
    activity_type: 'quiz_attempt',
    resource_id: quizId,
    resource_type: 'quiz',
    metadata: { score: earnedScore, totalPoints, percentage, passed },
  })

  revalidatePath('/quizzes')
  revalidatePath('/dashboard')
  revalidatePath('/analytics')

  return {
    success: true,
    attemptId: attempt.id,
    score: earnedScore,
    totalPoints,
    percentage,
    passed,
  }
}

export async function submitAssessment(
  assessmentId: string,
  content: string,
  fileUrls: string[] = []
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { data, error } = await supabase
    .from('assessment_submissions')
    .insert({
      assessment_id: assessmentId,
      student_id: user.id,
      content,
      file_urls: fileUrls,
      status: 'submitted',
      submitted_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Submission failed: ${error.message}`)
  }

  await supabase.from('learning_activities').insert({
    student_id: user.id,
    activity_type: 'assessment_submit',
    resource_id: assessmentId,
    resource_type: 'assessment',
    metadata: { submissionId: data.id },
  })

  revalidatePath('/assessments')
  revalidatePath('/dashboard')
  return { success: true, submissionId: data.id }
}

export async function submitProject(
  projectId: string,
  content: string,
  fileUrls: string[] = [],
  repositoryUrl?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { data, error } = await supabase
    .from('project_submissions')
    .insert({
      project_id: projectId,
      student_id: user.id,
      content,
      file_urls: fileUrls,
      repository_url: repositoryUrl || null,
      status: 'submitted',
      submitted_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Project submission failed: ${error.message}`)
  }

  await supabase.from('learning_activities').insert({
    student_id: user.id,
    activity_type: 'project_submit',
    resource_id: projectId,
    resource_type: 'project',
    metadata: { submissionId: data.id },
  })

  revalidatePath('/projects')
  revalidatePath('/dashboard')
  return { success: true, submissionId: data.id }
}

export async function enrollInCourse(courseId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('enrollments')
    .upsert(
      {
        student_id: user.id,
        course_id: courseId,
        progress_percentage: 0,
        status: 'active',
      },
      { onConflict: 'student_id,course_id' }
    )

  if (error) {
    throw new Error(`Enrollment failed: ${error.message}`)
  }

  revalidatePath('/dashboard')
  return { success: true }
}
