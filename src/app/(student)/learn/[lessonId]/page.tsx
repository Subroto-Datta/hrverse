import { getUser } from '@/lib/utils/auth'
import {
  getLessonById,
  getAllPublishedLessons,
  getStudentLessonProgress,
} from '@/lib/content/get-content'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Lock, ArrowLeft, Clock } from 'lucide-react'
import { LessonViewer } from './lesson-viewer'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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
  const completedLessonIds = new Set(
    progress
      ?.filter((p: any) => p.status === 'completed')
      .map((p: any) => p.lesson_id) || []
  )
  const isCompleted = completedLessonIds.has(lessonId)

  // 3. Find adjacent lessons for navigation in strict curriculum order
  const allLessons = await getAllPublishedLessons()

  let prevLessonId: string | null = null
  let prevLessonTitle: string | null = null
  let nextLessonId: string | null = null
  let nextLessonTitle: string | null = null
  let currentIndex = -1

  if (allLessons && allLessons.length > 0) {
    currentIndex = allLessons.findIndex((l: any) => l.id === lessonId)
    if (currentIndex > 0) {
      prevLessonId = allLessons[currentIndex - 1].id
      prevLessonTitle = allLessons[currentIndex - 1].title
    }
    if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
      nextLessonId = allLessons[currentIndex + 1].id
      nextLessonTitle = allLessons[currentIndex + 1].title
    }
  }

  // 4. Sequential Unlocking Check
  // Admins and instructors bypass sequential locks for course evaluation
  const isAdminOrInstructor =
    user?.user_metadata?.role === 'admin' || user?.user_metadata?.role === 'instructor'

  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const isUnlocked =
    isAdminOrInstructor ||
    currentIndex <= 0 ||
    (previousLesson && completedLessonIds.has(previousLesson.id))

  // If locked, present the dedicated Locked State Screen
  if (!isUnlocked && previousLesson) {
    return (
      <div className="p-6 sm:p-10 max-w-2xl mx-auto py-16">
        <Card className="border border-amber-500/30 bg-gradient-to-b from-card via-card to-amber-500/[0.03] shadow-lg text-center p-8 space-y-6">
          <div className="h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400">
            <Lock className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <Badge variant="outline" className="text-xs text-amber-700 dark:text-amber-300 border-amber-500/30 bg-amber-500/10">
              Sequential Learning Unlocked
            </Badge>
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              This Day is Locked
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Curriculum days unlock in sequence. You must complete the required coursework, case interactions, and checklist for the previous day before accessing this module.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border/80 bg-muted/40 text-left space-y-1.5 max-w-md mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Prerequisite Required:
            </span>
            <h4 className="text-sm font-bold text-foreground">
              {previousLesson.title}
            </h4>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> Complete all interactions and mark as completed.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href={`/learn/${previousLesson.id}`} className="w-full sm:w-auto">
              <Button className="w-full gap-2 font-semibold">
                <ArrowLeft className="h-4 w-4" /> Go to {previousLesson.title.split(':')[0] || 'Previous Day'}
              </Button>
            </Link>
            <Link href="/learn" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full gap-2">
                All Lessons
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <LessonViewer
        lesson={lesson}
        isCompletedInitially={isCompleted}
        prevLessonId={prevLessonId}
        prevLessonTitle={prevLessonTitle}
        nextLessonId={nextLessonId}
        nextLessonTitle={nextLessonTitle}
        dayIndex={currentIndex >= 0 ? currentIndex + 1 : undefined}
        totalLessons={allLessons.length}
      />
    </div>
  )
}
