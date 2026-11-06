import { getUser } from '@/lib/utils/auth'
import {
  getQuizById,
  getQuizQuestions,
  isModuleFinishedByStudent,
} from '@/lib/content/get-content'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Lock, ArrowLeft, Clock, BookOpen } from 'lucide-react'
import { QuizRunner } from './quiz-runner'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function QuizRunnerPage({
  params,
}: {
  params: Promise<{ quizId: string }>
}) {
  const { quizId } = await params
  const user = await getUser()
  const isAdmin =
    user?.user_metadata?.role === 'admin' || user?.user_metadata?.role === 'instructor'

  // 1. Fetch quiz metadata safely
  const quiz = await getQuizById(quizId)

  if (!quiz) {
    notFound()
  }

  // 2. Enforce week completion prerequisite if quiz belongs to a module
  if (quiz.module_id && !isAdmin) {
    const moduleStatus = await isModuleFinishedByStudent(user?.id || '', quiz.module_id)

    if (!moduleStatus.isFinished) {
      const nextPendingLesson = moduleStatus.uncompletedLessons[0]

      return (
        <div className="p-6 sm:p-10 max-w-2xl mx-auto py-16">
          <Card className="border border-amber-500/30 bg-gradient-to-b from-card via-card to-amber-500/[0.03] shadow-lg text-center p-8 space-y-6">
            <div className="h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400">
              <Lock className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <Badge variant="outline" className="text-xs text-amber-700 dark:text-amber-300 border-amber-500/30 bg-amber-500/10">
                Week Completion Prerequisite
              </Badge>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                This Quiz is Locked
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                To ensure thorough preparation and academic integrity, you must finish all daily lessons for{' '}
                <strong className="text-foreground">{moduleStatus.moduleTitle}</strong> before unlocking this assessment.
              </p>
            </div>

            {/* Progress Card */}
            <div className="p-4 rounded-xl border border-border/80 bg-muted/40 text-left space-y-2.5 max-w-md mx-auto">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground">Week Coursework Progress:</span>
                <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                  {moduleStatus.completedLessons} of {moduleStatus.totalLessons} Days Completed
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden border border-border/60">
                <div
                  className="bg-amber-500 h-full transition-all duration-300"
                  style={{
                    width: `${Math.round(
                      (moduleStatus.completedLessons / (moduleStatus.totalLessons || 1)) * 100
                    )}%`,
                  }}
                />
              </div>
              {nextPendingLesson && (
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 pt-1">
                  <Clock className="h-3 w-3 text-amber-500" /> Next pending lesson:{' '}
                  <span className="font-medium text-foreground truncate">
                    {nextPendingLesson.title}
                  </span>
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {nextPendingLesson ? (
                <Link href={`/learn/${nextPendingLesson.id}`} className="w-full sm:w-auto">
                  <Button className="w-full gap-2 font-semibold bg-primary text-primary-foreground shadow-xs">
                    <BookOpen className="h-4 w-4" /> Resume {nextPendingLesson.title.split(':')[0] || 'Next Lesson'}
                  </Button>
                </Link>
              ) : (
                <Link href="/learn" className="w-full sm:w-auto">
                  <Button className="w-full gap-2 font-semibold">
                    <BookOpen className="h-4 w-4" /> Go to Learning Workspace
                  </Button>
                </Link>
              )}
              <Link href="/quizzes" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full gap-2">
                  <ArrowLeft className="h-4 w-4" /> All Quizzes
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      )
    }
  }

  // 3. Fetch quiz questions (options only, NOT leaking correct answers to client)
  const questions = await getQuizQuestions(quizId)

  if (!questions || questions.length === 0) {
    notFound()
  }

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto">
      <QuizRunner quiz={quiz} questions={questions} />
    </div>
  )
}
