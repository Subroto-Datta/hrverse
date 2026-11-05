import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/utils/auth'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ClipboardCheck, FileText, CheckCircle2, Clock, ArrowRight } from 'lucide-react'

export default async function AssessmentsOverviewPage() {
  const user = await getUser()
  const supabase = await createClient()

  // Fetch published assessments
  const { data: assessments } = await supabase
    .from('assessments')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: true })

  // Fetch user submissions
  const { data: submissions } = await supabase
    .from('assessment_submissions')
    .select('*')
    .eq('student_id', user?.id || '')

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-5xl mx-auto">
      <div className="border-b border-border pb-6 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Written Case Assessments
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Apply HR frameworks to real turnaround scenarios. Submissions are reviewed against standardized rubrics.
        </p>
      </div>

      <div className="space-y-6">
        {assessments?.map((assessment) => {
          const submission = submissions?.find((s) => s.assessment_id === assessment.id)
          const isGraded = submission?.status === 'graded'
          const isSubmitted = submission?.status === 'submitted'

          return (
            <Card key={assessment.id} className="border border-border/80 shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {assessment.max_score} Max Points
                  </Badge>

                  {isGraded ? (
                    <Badge className="bg-emerald-600 text-white gap-1 text-[11px]">
                      <CheckCircle2 className="h-3 w-3" /> Graded: {submission.score}/{assessment.max_score}
                    </Badge>
                  ) : isSubmitted ? (
                    <Badge className="bg-amber-600 text-white gap-1 text-[11px]">
                      <Clock className="h-3 w-3" /> Under Evaluation
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[11px]">
                      Open for Submission
                    </Badge>
                  )}
                </div>

                <CardTitle className="text-base sm:text-lg font-bold text-foreground mt-1">
                  {assessment.title}
                </CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  {assessment.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>• Detailed executive scenario provided in reference brief</p>
                  <p>• Multi-dimensional grading rubric (Analysis, Strategy, Financials, Feasibility)</p>
                </div>

                <Link href={`/assessments/${assessment.id}`}>
                  <Button size="sm" className="gap-1.5 text-xs">
                    {submission ? 'View Submission & Feedback' : 'Open Assessment Brief'}{' '}
                    <ArrowRight className="h-3.5 w-3.5" />
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

