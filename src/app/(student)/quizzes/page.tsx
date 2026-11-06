import { getUser } from '@/lib/utils/auth'
import {
  getPublishedQuizzes,
  getStudentQuizAttempts,
  getPublishedModules,
  getStudentLessonProgress,
} from '@/lib/content/get-content'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HelpCircle, Clock, CheckCircle2, XCircle, ArrowRight, Lock } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function QuizzesOverviewPage() {
  const user = await getUser()
  const isAdmin =
    user?.user_metadata?.role === 'admin' || user?.user_metadata?.role === 'instructor'

  // Safely fetch published quizzes and user attempts
  const quizzes = await getPublishedQuizzes()
  const attempts = await getStudentQuizAttempts(user?.id || '')

  // Safely fetch modules and student lesson progress to verify week completion
  const modules = await getPublishedModules()
  const lessonProgress = await getStudentLessonProgress(user?.id || '')
  const completedLessonIds = new Set(
    lessonProgress
      ?.filter((p: any) => p.status === 'completed')
      .map((p: any) => p.lesson_id) || []
  )

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-5xl mx-auto">
      <div className="border-b border-border pb-6 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Quizzes & Knowledge Checks
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Validate your understanding of HR strategy, metrics, laws, and compensation formulas. Quizzes unlock once the respective week is completed.
        </p>
      </div>

      {(!quizzes || quizzes.length === 0) ? (
        <Card className="border border-border/80 shadow-sm p-8 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <HelpCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-foreground">No Published Quizzes Yet</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Module quizzes and diagnostic knowledge checks will appear here once released.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz: any) => {
            const userAttemptsForThis =
              attempts?.filter((a: any) => a.quiz_id === quiz.id) || []
            const bestAttempt = [...userAttemptsForThis].sort(
              (a: any, b: any) => Number(b.percentage) - Number(a.percentage)
            )[0]
            const hasPassed = bestAttempt && bestAttempt.passed

            // Check if the corresponding week's lessons are all completed
            const module = modules?.find((m: any) => m.id === quiz.module_id)
            const moduleLessons = (module?.parts || []).flatMap((p: any) => p.lessons || [])
            const completedCount = moduleLessons.filter((l: any) =>
              completedLessonIds.has(l.id)
            ).length
            const totalCount = moduleLessons.length

            const isWeekFinished =
              isAdmin || (totalCount > 0 && completedCount >= totalCount)
            const nextUncompletedLesson = moduleLessons.find(
              (l: any) => !completedLessonIds.has(l.id)
            )

            return (
              <Card
                key={quiz.id}
                className={`border shadow-sm flex flex-col justify-between transition-all ${
                  isWeekFinished
                    ? 'border-border/80 bg-card hover:border-amber-500/35 hover:shadow-md'
                    : 'border-border/50 bg-muted/15 opacity-85'
                }`}
              >
                <CardHeader className="space-y-2 pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="text-xs">
                      {quiz.quiz_questions?.length || 20} Questions
                    </Badge>

                    {!isWeekFinished ? (
                      <Badge
                        variant="outline"
                        className="text-[10px] text-amber-700 dark:text-amber-300 border-amber-500/30 bg-amber-500/10 gap-1 font-semibold"
                      >
                        <Lock className="h-3 w-3" /> Week {module?.order_index || 1} Incomplete
                      </Badge>
                    ) : bestAttempt ? (
                      hasPassed ? (
                        <Badge className="bg-emerald-600 text-white gap-1 text-[11px]">
                          <CheckCircle2 className="h-3 w-3" /> Passed ({bestAttempt.percentage}%)
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1 text-[11px]">
                          <XCircle className="h-3 w-3" /> Best: {bestAttempt.percentage}%
                        </Badge>
                      )
                    ) : (
                      <Badge variant="secondary" className="text-[11px]">
                        Ready to Start
                      </Badge>
                    )}
                  </div>

                  <CardTitle className="text-base font-bold text-foreground">
                    {quiz.title}
                  </CardTitle>
                  <CardDescription className="text-xs leading-relaxed">
                    {quiz.description ||
                      'Comprehensive module multiple-choice knowledge evaluation.'}
                  </CardDescription>

                  {!isWeekFinished && totalCount > 0 && (
                    <div className="p-2.5 rounded-lg border border-border/70 bg-background/50 space-y-1.5 mt-2">
                      <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
                        <span>Prerequisite: Finish Week {module?.order_index || 1}</span>
                        <span className="font-mono font-bold text-foreground">
                          {completedCount}/{totalCount} Days
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-amber-500 h-full transition-all duration-300"
                          style={{
                            width: `${Math.round((completedCount / totalCount) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="pt-3 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {quiz.time_limit_minutes || 30} mins
                    </span>
                    <span>Pass: {quiz.passing_score}%</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isWeekFinished ? (
                      <Link href={`/quizzes/${quiz.id}`}>
                        <Button size="sm" className="gap-1.5 text-xs h-8 font-semibold shadow-xs">
                          {bestAttempt ? 'Retake Quiz' : 'Start Quiz'}{' '}
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled
                          className="gap-1 text-xs h-8 opacity-50 cursor-not-allowed border-dashed"
                        >
                          <Lock className="h-3 w-3" /> Locked
                        </Button>

                        {nextUncompletedLesson && (
                          <Link href={`/learn/${nextUncompletedLesson.id}`}>
                            <Button size="sm" className="gap-1 text-xs h-8 font-semibold bg-primary text-primary-foreground shadow-xs">
                              Resume {nextUncompletedLesson.title.split(':')[0] || 'Day'}{' '}
                              <ArrowRight className="h-3 w-3" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
