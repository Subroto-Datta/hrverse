import { getUser } from '@/lib/utils/auth'
import {
  getStudentQuizAttempts,
  getStudentLessonProgress,
  getTotalPublishedLessonsCount,
} from '@/lib/content/get-content'
import { StudentAnalyticsClient } from './student-analytics-client'

export default async function StudentAnalyticsPage() {
  const user = await getUser()
  const studentId = user?.id || ''

  // 1. Fetch user quiz attempts safely
  const attempts = await getStudentQuizAttempts(studentId)

  // 2. Fetch completed lessons count safely
  const progress = await getStudentLessonProgress(studentId)
  const completedCount = progress.filter((p: any) => p.status === 'completed').length

  // 3. Total published lessons safely
  const totalLessons = await getTotalPublishedLessonsCount()

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-5xl mx-auto">
      <div className="border-b border-border pb-6 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Performance Analytics
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Visualize your learning velocity, quiz accuracy, and AI diagnostic insights.
        </p>
      </div>

      <StudentAnalyticsClient
        attempts={attempts || []}
        completedCount={completedCount || 0}
        totalLessons={totalLessons || 6}
      />
    </div>
  )
}
