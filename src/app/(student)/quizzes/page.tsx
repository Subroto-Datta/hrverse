import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/utils/auth'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HelpCircle, Clock, CheckCircle2, XCircle, ArrowRight } from 'lucide-react'

export default async function QuizzesOverviewPage() {
  const user = await getUser()
  const supabase = await createClient()

  // Fetch published quizzes
  const { data: quizzes } = await supabase
    .from('quizzes')
    .select('*, quiz_questions(id)')
    .eq('is_published', true)
    .order('created_at', { ascending: true })

  // Fetch user attempts
  const { data: attempts } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('student_id', user?.id || '')
    .order('percentage', { ascending: false })

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizzes?.map((quiz) => {
          const userAttemptsForThis = attempts?.filter((a) => a.quiz_id === quiz.id) || []
          const bestAttempt = userAttemptsForThis[0] // highest percentage
          const hasPassed = bestAttempt && bestAttempt.passed

          return (
            <Card key={quiz.id} className="border border-border/80 shadow-sm flex flex-col justify-between">
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
                  {quiz.description || 'Comprehensive module multiple-choice knowledge evaluation.'}
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
                    {bestAttempt ? 'Retake Quiz' : 'Start Quiz'} <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
