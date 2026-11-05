import { getUser } from '@/lib/utils/auth'
import { getPublishedQuizzes, getStudentQuizAttempts } from '@/lib/content/get-content'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HelpCircle, Clock, CheckCircle2, XCircle, ArrowRight } from 'lucide-react'

export default async function QuizzesOverviewPage() {
  const user = await getUser()

  // Safely fetch published quizzes
  const quizzes = await getPublishedQuizzes()

  // Safely fetch user attempts
  const attempts = await getStudentQuizAttempts(user?.id || '')

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-5xl mx-auto">
      <div className="border-b border-border pb-6 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Quizzes & Knowledge Checks
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Validate your understanding of HR strategy, metrics, laws, and compensation formulas.
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

            return (
              <Card
                key={quiz.id}
                className="border border-border/80 shadow-sm flex flex-col justify-between"
              >
                <CardHeader className="space-y-2 pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {quiz.quiz_questions?.length || 20} Questions
                    </Badge>
                    {bestAttempt ? (
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
                        Not Attempted
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
                </CardHeader>

                <CardContent className="pt-2 border-t border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {quiz.time_limit_minutes || 30} mins
                    </span>
                    <span>Pass: {quiz.passing_score}%</span>
                  </div>

                  <Link href={`/quizzes/${quiz.id}`}>
                    <Button size="sm" className="gap-1.5 text-xs h-8">
                      {bestAttempt ? 'Retake Quiz' : 'Start Quiz'}{' '}
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
