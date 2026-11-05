import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/utils/auth'
import { notFound } from 'next/navigation'
import { LessonViewer } from './lesson-viewer'

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>
}) {
  const { lessonId } = await params
  const user = await getUser()
  const supabase = await createClient()

  // 1. Fetch lesson details
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*, parts(*, modules(*))')
    .eq('id', lessonId)
    .single()

  if (error || !lesson) {
    notFound()
  }

  // 2. Fetch completion status
  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('status')
    .eq('student_id', user?.id || '')
    .eq('lesson_id', lessonId)
    .single()

  const isCompleted = progress?.status === 'completed'

  // 3. Find adjacent lessons for navigation
  const { data: allLessons } = await supabase
    .from('lessons')
    .select('id, order_index')
    .eq('is_published', true)
    .order('order_index', { ascending: true })

  let prevLessonId: string | null = null
  let nextLessonId: string | null = null

  if (allLessons) {
    const currentIndex = allLessons.findIndex((l) => l.id === lessonId)
    if (currentIndex > 0) prevLessonId = allLessons[currentIndex - 1].id
    if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
      nextLessonId = allLessons[currentIndex + 1].id
    }
  }

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto">
      <LessonViewer
        lesson={lesson}
        isCompletedInitially={isCompleted}
        prevLessonId={prevLessonId}
        nextLessonId={nextLessonId}
      />
    </div>
  )
}

