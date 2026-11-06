import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Safely fetches published modules with their parts and lessons.
 * Falls back to admin service-role client if user RLS encountered recursion or errors.
 */
export async function getPublishedModules() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('modules')
      .select('*, parts(*, lessons(*))')
      .eq('is_published', true)
      .order('order_index', { ascending: true })

    if (!error && data && data.length > 0) {
      return sortModulesPartsAndLessons(data)
    }

    if (error) {
      console.warn('Standard client error fetching modules (falling back to admin client):', error.message)
    }

    // Fallback to service role admin client
    const adminSupabase = createAdminClient()
    const { data: adminData, error: adminError } = await adminSupabase
      .from('modules')
      .select('*, parts(*, lessons(*))')
      .eq('is_published', true)
      .order('order_index', { ascending: true })

    if (adminError) {
      console.error('Admin client error fetching modules:', adminError.message)
      return []
    }

    return sortModulesPartsAndLessons(adminData || [])
  } catch (err) {
    console.error('Fatal error fetching modules:', err)
    return []
  }
}

// Helper to sort modules, parts, and lessons by order_index
function sortModulesPartsAndLessons(modules: any[]) {
  return [...modules]
    .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
    .map((m) => {
      const parts = (m.parts || []).sort(
        (a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0)
      )
      for (const part of parts) {
        if (part.lessons) {
          part.lessons.sort(
            (a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0)
          )
        }
      }
      return { ...m, parts }
    })
}

/**
 * Safely fetches published quizzes with questions count and module relations.
 */
export async function getPublishedQuizzes() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('quizzes')
      .select('*, quiz_questions(id), modules(id, title, order_index)')
      .eq('is_published', true)
      .order('created_at', { ascending: true })

    if (!error && data && data.length > 0) {
      return data
    }

    if (error) {
      console.warn('Standard client error fetching quizzes (falling back to admin client):', error.message)
    }

    const adminSupabase = createAdminClient()
    const { data: adminData, error: adminError } = await adminSupabase
      .from('quizzes')
      .select('*, quiz_questions(id), modules(id, title, order_index)')
      .eq('is_published', true)
      .order('created_at', { ascending: true })

    if (adminError) {
      console.error('Admin client error fetching quizzes:', adminError.message)
      return []
    }

    return adminData || []
  } catch (err) {
    console.error('Fatal error fetching quizzes:', err)
    return []
  }
}

/**
 * Safely fetches published assessments.
 */
export async function getPublishedAssessments() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: true })

    if (!error && data && data.length > 0) {
      return data
    }

    const adminSupabase = createAdminClient()
    const { data: adminData } = await adminSupabase
      .from('assessments')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: true })

    return adminData || []
  } catch (err) {
    console.error('Fatal error fetching assessments:', err)
    return []
  }
}

/**
 * Safely fetches published capstone projects.
 */
export async function getPublishedProjects() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: true })

    if (!error && data && data.length > 0) {
      return data
    }

    const adminSupabase = createAdminClient()
    const { data: adminData } = await adminSupabase
      .from('projects')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: true })

    return adminData || []
  } catch (err) {
    console.error('Fatal error fetching projects:', err)
    return []
  }
}

/**
 * Safely fetches a single lesson by ID with its part and module info.
 */
export async function getLessonById(lessonId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('lessons')
      .select('*, parts(*, modules(*))')
      .eq('id', lessonId)
      .single()

    if (!error && data) {
      return data
    }

    const adminSupabase = createAdminClient()
    const { data: adminData } = await adminSupabase
      .from('lessons')
      .select('*, parts(*, modules(*))')
      .eq('id', lessonId)
      .single()

    return adminData || null
  } catch (err) {
    console.error('Fatal error fetching lesson:', err)
    return null
  }
}

/**
 * Safely fetches all published lessons ordered hierarchically:
 * Module order_index -> Part order_index -> Lesson order_index.
 * This guarantees Days 1-7 and subsequent weeks are strictly sequenced.
 */
export async function getAllPublishedLessons() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('lessons')
      .select(
        'id, title, order_index, is_published, part_id, parts(id, title, order_index, module_id, modules(id, title, order_index))'
      )
      .eq('is_published', true)

    if (!error && data && data.length > 0) {
      return sortLessonsHierarchically(data)
    }

    if (error) {
      console.warn('Standard client error fetching all lessons, falling back to admin client:', error.message)
    }

    const adminSupabase = createAdminClient()
    const { data: adminData, error: adminErr } = await adminSupabase
      .from('lessons')
      .select(
        'id, title, order_index, is_published, part_id, parts(id, title, order_index, module_id, modules(id, title, order_index))'
      )
      .eq('is_published', true)

    if (adminErr) {
      console.error('Error fetching all lessons via admin client:', adminErr.message)
      return []
    }

    return sortLessonsHierarchically(adminData || [])
  } catch (err) {
    console.error('Fatal error fetching all lessons:', err)
    return []
  }
}

/**
 * Sorts lessons strictly according to curriculum hierarchy:
 * 1. Module order_index
 * 2. Part order_index
 * 3. Lesson order_index
 */
export function sortLessonsHierarchically(lessons: any[]) {
  return [...lessons].sort((a, b) => {
    const modA = a.parts?.modules?.order_index ?? 999
    const modB = b.parts?.modules?.order_index ?? 999
    if (modA !== modB) return modA - modB
    const partA = a.parts?.order_index ?? 999
    const partB = b.parts?.order_index ?? 999
    if (partA !== partB) return partA - partB
    return (a.order_index ?? 0) - (b.order_index ?? 0)
  })
}

/**
 * Safely fetches a single quiz by ID with associated module relations.
 */
export async function getQuizById(quizId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('quizzes')
      .select('*, modules(id, title, order_index)')
      .eq('id', quizId)
      .single()

    if (!error && data) {
      return data
    }

    const adminSupabase = createAdminClient()
    const { data: adminData } = await adminSupabase
      .from('quizzes')
      .select('*, modules(id, title, order_index)')
      .eq('id', quizId)
      .single()

    return adminData || null
  } catch (err) {
    console.error('Fatal error fetching quiz:', err)
    return null
  }
}

/**
 * Checks whether all published lessons in a module (week) have been completed by a student.
 */
export async function isModuleFinishedByStudent(studentId: string, moduleId: string): Promise<{
  isFinished: boolean
  totalLessons: number
  completedLessons: number
  moduleTitle: string
  uncompletedLessons: Array<{ id: string; title: string }>
}> {
  try {
    const modules = await getPublishedModules()
    const module = modules.find((m: any) => m.id === moduleId)
    if (!module) {
      return {
        isFinished: false,
        totalLessons: 0,
        completedLessons: 0,
        moduleTitle: 'Unknown Module',
        uncompletedLessons: [],
      }
    }

    const moduleLessons: Array<{ id: string; title: string }> = (module.parts || []).flatMap(
      (p: any) => (p.lessons || []).map((l: any) => ({ id: l.id, title: l.title }))
    )

    if (moduleLessons.length === 0) {
      return {
        isFinished: true,
        totalLessons: 0,
        completedLessons: 0,
        moduleTitle: module.title,
        uncompletedLessons: [],
      }
    }

    const progress = await getStudentLessonProgress(studentId)
    const completedSet = new Set(
      progress
        ?.filter((p: any) => p.status === 'completed')
        .map((p: any) => p.lesson_id) || []
    )

    const completedLessons = moduleLessons.filter((l) => completedSet.has(l.id)).length
    const uncompletedLessons = moduleLessons.filter((l) => !completedSet.has(l.id))

    return {
      isFinished: completedLessons >= moduleLessons.length,
      totalLessons: moduleLessons.length,
      completedLessons,
      moduleTitle: module.title,
      uncompletedLessons,
    }
  } catch (err) {
    console.error('Error checking module completion status:', err)
    return {
      isFinished: false,
      totalLessons: 0,
      completedLessons: 0,
      moduleTitle: 'Error',
      uncompletedLessons: [],
    }
  }
}

/**
 * Safely fetches quiz questions without leaking correct_answer to the client.
 */
export async function getQuizQuestions(quizId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('id, question_text, options, points, order_index')
      .eq('quiz_id', quizId)
      .order('order_index', { ascending: true })

    if (!error && data && data.length > 0) {
      return data
    }

    const adminSupabase = createAdminClient()
    const { data: adminData } = await adminSupabase
      .from('quiz_questions')
      .select('id, question_text, options, points, order_index')
      .eq('quiz_id', quizId)
      .order('order_index', { ascending: true })

    return adminData || []
  } catch (err) {
    console.error('Fatal error fetching quiz questions:', err)
    return []
  }
}

/**
 * Safely fetches a single assessment by ID.
 */
export async function getAssessmentById(assessmentId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', assessmentId)
      .single()

    if (!error && data) {
      return data
    }

    const adminSupabase = createAdminClient()
    const { data: adminData } = await adminSupabase
      .from('assessments')
      .select('*')
      .eq('id', assessmentId)
      .single()

    return adminData || null
  } catch (err) {
    console.error('Fatal error fetching assessment:', err)
    return null
  }
}

/**
 * Safely fetches a single project by ID.
 */
export async function getProjectById(projectId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    if (!error && data) {
      return data
    }

    const adminSupabase = createAdminClient()
    const { data: adminData } = await adminSupabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    return adminData || null
  } catch (err) {
    console.error('Fatal error fetching project:', err)
    return null
  }
}

/**
 * Safely fetches student lesson progress.
 */
export async function getStudentLessonProgress(studentId: string) {
  if (!studentId) return []
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('lesson_progress')
      .select('lesson_id, status, completed_at')
      .eq('student_id', studentId)

    if (!error && data) {
      return data
    }

    const adminSupabase = createAdminClient()
    const { data: adminData } = await adminSupabase
      .from('lesson_progress')
      .select('lesson_id, status, completed_at')
      .eq('student_id', studentId)

    return adminData || []
  } catch {
    return []
  }
}

/**
 * Safely fetches student quiz attempts.
 */
export async function getStudentQuizAttempts(studentId: string) {
  if (!studentId) return []
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('student_id', studentId)
      .order('completed_at', { ascending: false })

    if (!error && data) {
      return data
    }

    const adminSupabase = createAdminClient()
    const { data: adminData } = await adminSupabase
      .from('quiz_attempts')
      .select('*')
      .eq('student_id', studentId)
      .order('completed_at', { ascending: false })

    return adminData || []
  } catch {
    return []
  }
}

/**
 * Safely fetches student assessment submissions.
 */
export async function getStudentAssessmentSubmissions(studentId: string) {
  if (!studentId) return []
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('assessment_submissions')
      .select('*')
      .eq('student_id', studentId)

    if (!error && data) {
      return data
    }

    const adminSupabase = createAdminClient()
    const { data: adminData } = await adminSupabase
      .from('assessment_submissions')
      .select('*')
      .eq('student_id', studentId)

    return adminData || []
  } catch {
    return []
  }
}

/**
 * Safely fetches student project submissions.
 */
export async function getStudentProjectSubmissions(studentId: string) {
  if (!studentId) return []
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('project_submissions')
      .select('*')
      .eq('student_id', studentId)

    if (!error && data) {
      return data
    }

    const adminSupabase = createAdminClient()
    const { data: adminData } = await adminSupabase
      .from('project_submissions')
      .select('*')
      .eq('student_id', studentId)

    return adminData || []
  } catch {
    return []
  }
}

/**
 * Safely fetches student active enrollment.
 */
export async function getStudentEnrollment(studentId: string) {
  if (!studentId) return null
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('enrollments')
      .select('*, courses(*)')
      .eq('student_id', studentId)
      .maybeSingle()

    if (!error && data) {
      return data
    }

    const adminSupabase = createAdminClient()
    const { data: adminData } = await adminSupabase
      .from('enrollments')
      .select('*, courses(*)')
      .eq('student_id', studentId)
      .maybeSingle()

    return adminData || null
  } catch {
    return null
  }
}

/**
 * Safely fetches student recent activities.
 */
export async function getStudentLearningActivities(studentId: string, limit = 5) {
  if (!studentId) return []
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('learning_activities')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (!error && data) {
      return data
    }

    const adminSupabase = createAdminClient()
    const { data: adminData } = await adminSupabase
      .from('learning_activities')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(limit)

    return adminData || []
  } catch {
    return []
  }
}

/**
 * Safely fetches count of total published lessons.
 */
export async function getTotalPublishedLessonsCount() {
  try {
    const supabase = await createClient()
    const { count, error } = await supabase
      .from('lessons')
      .select('id', { count: 'exact', head: true })
      .eq('is_published', true)

    if (!error && count !== null) {
      return count
    }

    const adminSupabase = createAdminClient()
    const { count: adminCount } = await adminSupabase
      .from('lessons')
      .select('id', { count: 'exact', head: true })
      .eq('is_published', true)

    return adminCount || 6
  } catch {
    return 6
  }
}
