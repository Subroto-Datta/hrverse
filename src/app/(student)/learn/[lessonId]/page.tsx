import { getUser } from '@/lib/utils/auth'
import {
  getLessonById,
  getAllPublishedLessons,
  getStudentLessonProgress,
} from '@/lib/content/get-content'
import { notFound } from 'next/navigation'
import { LessonViewer } from './lesson-viewer'

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>
}) {
  const { lessonId } = await params
  const user = await getUser()

  // 1. Fetch lesson details safely
  const lesson = await getLessonById(lessonId)

  if (!lesson) {
    notFound()
  }

  // 2. Fetch completion status safely
  const progress = await getStudentLessonProgress(user?.id || '')
  const isCompleted = progress.some(
    (p: any) => p.lesson_id === lessonId && p.status === 'completed'
  )

  // 3. Find adjacent lessons for navigation safely
  const allLessons = await getAllPublishedLessons()

  let prevLessonId: string | null = null
  let nextLessonId: string | null = null

  if (allLessons && allLessons.length > 0) {
    const currentIndex = allLessons.findIndex((l: any) => l.id === lessonId)
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
