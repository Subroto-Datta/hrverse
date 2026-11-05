'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function completeLesson(lessonId: string, timeSpentSeconds: number = 60) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  // 1. Upsert lesson progress (try user client, fallback to admin client)
  const progressPayload = {
    student_id: user.id,
    lesson_id: lessonId,
    status: 'completed',
    completed_at: new Date().toISOString(),
    time_spent_seconds: timeSpentSeconds,
  }

  const { error: progressError } = await supabase
    .from('lesson_progress')
    .upsert(progressPayload, { onConflict: 'student_id,lesson_id' })

  if (progressError) {
    const adminSupabase = createAdminClient()
    const { error: adminErr } = await adminSupabase
      .from('lesson_progress')
      .upsert(progressPayload, { onConflict: 'student_id,lesson_id' })

    if (adminErr) {
      throw new Error(`Failed to update progress: ${adminErr.message}`)
    }
  }

  // 2. Log activity
  const activityPayload = {
    student_id: user.id,
    activity_type: 'lesson_complete',
    resource_id: lessonId,
    resource_type: 'lesson',
    metadata: { timeSpentSeconds },
  }

  const { error: actError } = await supabase.from('learning_activities').insert(activityPayload)
  if (actError) {
    const adminSupabase = createAdminClient()
    await adminSupabase.from('learning_activities').insert(activityPayload)
  }

  // 3. Recalculate course progress
  const adminSupabase = createAdminClient()
  const { data: lesson } = await adminSupabase
    .from('lessons')
    .select('parts(modules(course_id))')
    .eq('id', lessonId)
    .single()

  const courseId = (lesson?.parts as unknown as { modules: { course_id: string } })?.modules
    ?.course_id

  if (courseId) {
    const { count: totalLessons } = await adminSupabase
      .from('lessons')
      .select('id, parts!inner(modules!inner(course_id))', { count: 'exact', head: true })
      .eq('parts.modules.course_id', courseId)
      .eq('is_published', true)

    const { count: completedCount } = await adminSupabase
      .from('lesson_progress')
      .select('id, lessons!inner(parts!inner(modules!inner(course_id)))', {
        count: 'exact',
        head: true,
      })
      .eq('lessons.parts.modules.course_id', courseId)
      .eq('student_id', user.id)
      .eq('status', 'completed')

    if (totalLessons && totalLessons > 0) {
      const percentage = Math.min(100, Math.round(((completedCount || 0) / totalLessons) * 100))
      await adminSupabase.from('enrollments').upsert(
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
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const adminSupabase = createAdminClient()

  // 1. Fetch questions to score server-side
  let questions: any[] | null = null
  const { data: qData, error: qError } = await supabase
    .from('quiz_questions')
    .select('id, correct_answer, points')
    .eq('quiz_id', quizId)

  if (!qError && qData && qData.length > 0) {
    questions = qData
  } else {
    const { data: adminQ } = await adminSupabase
      .from('quiz_questions')
      .select('id, correct_answer, points')
      .eq('quiz_id', quizId)
    questions = adminQ
  }

  if (!questions || questions.length === 0) {
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
  const { data: quiz } = await adminSupabase
    .from('quizzes')
    .select('passing_score')
    .eq('id', quizId)
    .single()

  const passingScore = quiz?.passing_score || 70
  const passed = percentage >= passingScore

  // 3. Insert quiz attempt
  const attemptPayload = {
    quiz_id: quizId,
    student_id: user.id,
    score: earnedScore,
    total_points: totalPoints,
    percentage: Math.round(percentage * 100) / 100,
    passed,
    answers,
    completed_at: new Date().toISOString(),
    time_spent_seconds: timeSpentSeconds,
  }

  let attemptId = ''
  const { data: attempt, error: insertError } = await supabase
    .from('quiz_attempts')
    .insert(attemptPayload)
    .select()
    .single()

  if (insertError || !attempt) {
    const { data: adminAttempt, error: adminErr } = await adminSupabase
      .from('quiz_attempts')
      .insert(attemptPayload)
      .select()
      .single()

    if (adminErr) {
      throw new Error(`Failed to record attempt: ${adminErr.message}`)
    }
    attemptId = adminAttempt.id
  } else {
    attemptId = attempt.id
  }

  // 4. Record learning activity
  const activityPayload = {
    student_id: user.id,
    activity_type: 'quiz_attempt',
    resource_id: quizId,
    resource_type: 'quiz',
    metadata: { score: earnedScore, totalPoints, percentage, passed },
  }
  await adminSupabase.from('learning_activities').insert(activityPayload)

  revalidatePath('/quizzes')
  revalidatePath('/dashboard')
  revalidatePath('/analytics')

  return {
    success: true,
    attemptId,
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
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const payload = {
    assessment_id: assessmentId,
    student_id: user.id,
    content,
    file_urls: fileUrls,
    status: 'submitted',
    submitted_at: new Date().toISOString(),
  }

  let submissionId = ''
  const { data, error } = await supabase
    .from('assessment_submissions')
    .insert(payload)
    .select()
    .single()

  if (error || !data) {
    const adminSupabase = createAdminClient()
    const { data: adminData, error: adminErr } = await adminSupabase
      .from('assessment_submissions')
      .insert(payload)
      .select()
      .single()

    if (adminErr) {
      throw new Error(`Submission failed: ${adminErr.message}`)
    }
    submissionId = adminData.id
  } else {
    submissionId = data.id
  }

  const adminSupabase = createAdminClient()
  await adminSupabase.from('learning_activities').insert({
    student_id: user.id,
    activity_type: 'assessment_submit',
    resource_id: assessmentId,
    resource_type: 'assessment',
    metadata: { submissionId },
  })

  revalidatePath('/assessments')
  revalidatePath('/dashboard')
  return { success: true, submissionId }
}

export async function submitProject(
  projectId: string,
  content: string,
  fileUrls: string[] = [],
  repositoryUrl?: string
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const payload = {
    project_id: projectId,
    student_id: user.id,
    content,
    file_urls: fileUrls,
    repository_url: repositoryUrl || null,
    status: 'submitted',
    submitted_at: new Date().toISOString(),
  }

  let submissionId = ''
  const { data, error } = await supabase
    .from('project_submissions')
    .insert(payload)
    .select()
    .single()

  if (error || !data) {
    const adminSupabase = createAdminClient()
    const { data: adminData, error: adminErr } = await adminSupabase
      .from('project_submissions')
      .insert(payload)
      .select()
      .single()

    if (adminErr) {
      throw new Error(`Project submission failed: ${adminErr.message}`)
    }
    submissionId = adminData.id
  } else {
    submissionId = data.id
  }

  const adminSupabase = createAdminClient()
  await adminSupabase.from('learning_activities').insert({
    student_id: user.id,
    activity_type: 'project_submit',
    resource_id: projectId,
    resource_type: 'project',
    metadata: { submissionId },
  })

  revalidatePath('/projects')
  revalidatePath('/dashboard')
  return { success: true, submissionId }
}

export async function enrollInCourse(courseId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const payload = {
    student_id: user.id,
    course_id: courseId,
    progress_percentage: 0,
    status: 'active',
  }

  const { error } = await supabase
    .from('enrollments')
    .upsert(payload, { onConflict: 'student_id,course_id' })

  if (error) {
    const adminSupabase = createAdminClient()
    const { error: adminErr } = await adminSupabase
      .from('enrollments')
      .upsert(payload, { onConflict: 'student_id,course_id' })

    if (adminErr) {
      throw new Error(`Enrollment failed: ${adminErr.message}`)
    }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
