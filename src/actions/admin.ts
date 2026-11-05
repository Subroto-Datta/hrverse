'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('Unauthorized: Authentication required')
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || profile?.role !== 'admin') {
    throw new Error('Forbidden: Administrative access required')
  }

  return { supabase, user }
}

// -------------------------------------------------------------
// COURSE MANAGEMENT
// -------------------------------------------------------------

export async function createCourse(formData: FormData) {
  const { supabase } = await assertAdmin()

  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string
  const durationWeeks = parseInt(formData.get('duration_weeks') as string || '8')
  const difficultyLevel = (formData.get('difficulty_level') as string) || 'intermediate'
  const isPublished = formData.get('is_published') === 'true'

  const { data, error } = await supabase
    .from('courses')
    .insert({
      title,
      slug,
      description,
      duration_weeks: durationWeeks,
      difficulty_level: difficultyLevel,
      is_published: isPublished,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create course: ${error.message}`)
  }

  revalidatePath('/admin/courses')
  revalidatePath('/courses')
  return { success: true, course: data }
}

export async function toggleCoursePublish(courseId: string, isPublished: boolean) {
  const { supabase } = await assertAdmin()

  const { error } = await supabase
    .from('courses')
    .update({ is_published: isPublished })
    .eq('id', courseId)

  if (error) {
    throw new Error(`Failed to update publish status: ${error.message}`)
  }

  revalidatePath('/admin/courses')
  revalidatePath('/courses')
  return { success: true }
}

// -------------------------------------------------------------
// MODULE & PART MANAGEMENT
// -------------------------------------------------------------

export async function createModule(courseId: string, title: string, description: string, orderIndex: number) {
  const { supabase } = await assertAdmin()

  const { data, error } = await supabase
    .from('modules')
    .insert({
      course_id: courseId,
      title,
      description,
      order_index: orderIndex,
      is_published: true,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create module: ${error.message}`)
  }

  revalidatePath('/admin/modules')
  return { success: true, module: data }
}

export async function createPart(moduleId: string, title: string, description: string, orderIndex: number) {
  const { supabase } = await assertAdmin()

  const { data, error } = await supabase
    .from('parts')
    .insert({
      module_id: moduleId,
      title,
      description,
      order_index: orderIndex,
      is_published: true,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create part: ${error.message}`)
  }

  revalidatePath('/admin/modules')
  return { success: true, part: data }
}

// -------------------------------------------------------------
// LESSON MANAGEMENT & RICH TEXT
// -------------------------------------------------------------

export async function saveLessonContent(
  lessonId: string,
  data: {
    title?: string
    content?: Record<string, unknown>
    summary?: string
    isPublished?: boolean
    estimatedMinutes?: number
  }
) {
  const { supabase } = await assertAdmin()

  const updatePayload: Record<string, unknown> = {}
  if (data.title !== undefined) updatePayload.title = data.title
  if (data.content !== undefined) updatePayload.content = data.content
  if (data.summary !== undefined) updatePayload.summary = data.summary
  if (data.isPublished !== undefined) updatePayload.is_published = data.isPublished
  if (data.estimatedMinutes !== undefined) updatePayload.estimated_minutes = data.estimatedMinutes

  const { error } = await supabase
    .from('lessons')
    .update(updatePayload)
    .eq('id', lessonId)

  if (error) {
    throw new Error(`Failed to save lesson: ${error.message}`)
  }

  revalidatePath('/admin/lessons')
  revalidatePath('/learn')
  return { success: true }
}

export async function createLesson(
  partId: string,
  title: string,
  slug: string,
  estimatedMinutes: number = 20,
  orderIndex: number = 0
) {
  const { supabase } = await assertAdmin()

  const { data, error } = await supabase
    .from('lessons')
    .insert({
      part_id: partId,
      title,
      slug,
      content: { blocks: [{ type: 'paragraph', data: { text: 'Draft lesson content...' } }] },
      estimated_minutes: estimatedMinutes,
      order_index: orderIndex,
      is_published: false,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create lesson: ${error.message}`)
  }

  revalidatePath('/admin/lessons')
  return { success: true, lesson: data }
}

// -------------------------------------------------------------
// SUBMISSION EVALUATION (GRADING)
// -------------------------------------------------------------

export async function gradeAssessmentSubmission(
  submissionId: string,
  score: number,
  feedback: string
) {
  const { supabase, user } = await assertAdmin()

  const { error } = await supabase
    .from('assessment_submissions')
    .update({
      score,
      feedback,
      status: 'graded',
      graded_at: new Date().toISOString(),
      graded_by: user.id,
    })
    .eq('id', submissionId)

  if (error) {
    throw new Error(`Failed to grade submission: ${error.message}`)
  }

  revalidatePath('/admin/submissions')
  revalidatePath('/assessments')
  return { success: true }
}

export async function gradeProjectSubmission(
  submissionId: string,
  score: number,
  feedback: string
) {
  const { supabase, user } = await assertAdmin()

  const { error } = await supabase
    .from('project_submissions')
    .update({
      score,
      feedback,
      status: 'graded',
      graded_at: new Date().toISOString(),
      graded_by: user.id,
    })
    .eq('id', submissionId)

  if (error) {
    throw new Error(`Failed to grade project: ${error.message}`)
  }

  revalidatePath('/admin/submissions')
  revalidatePath('/projects')
  return { success: true }
}

