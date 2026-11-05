import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/utils/auth'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FolderKanban, CheckCircle2, Clock, ArrowRight, Award } from 'lucide-react'

export default async function ProjectsOverviewPage() {
  const user = await getUser()
  const supabase = await createClient()

  // Fetch published projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: true })

  // Fetch student submissions
  const { data: submissions } = await supabase
    .from('project_submissions')
    .select('*')
    .eq('student_id', user?.id || '')

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-5xl mx-auto">
      <div className="border-b border-border pb-6 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Capstone Projects & Portfolios
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Build industry-grade executive portfolios. Successful completion of both capstones is mandatory for CHRMP certification.
        </p>
      </div>

      <div className="space-y-6">
        {projects?.map((project) => {
          const submission = submissions?.find((s) => s.project_id === project.id)
          const isGraded = submission?.status === 'graded'
          const isSubmitted = submission?.status === 'submitted'

          return (
            <Card key={project.id} className="border border-border/80 shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {project.max_score} Max Points
                  </Badge>

                  {isGraded ? (
                    <Badge className="bg-emerald-600 text-white gap-1 text-[11px]">
                      <CheckCircle2 className="h-3 w-3" /> Graded: {submission.score}/{project.max_score}
                    </Badge>
                  ) : isSubmitted ? (
                    <Badge className="bg-amber-600 text-white gap-1 text-[11px]">
                      <Clock className="h-3 w-3" /> Under Board Review
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[11px]">
                      Open Capstone
                    </Badge>
                  )}
                </div>

                <CardTitle className="text-base sm:text-lg font-bold text-foreground mt-1">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  {project.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>• Multi-part executive deliverable (Charter, Risk Matrix, Final Presentation)</p>
                  <p>• Evaluated by certified HR leadership reviewers</p>
                </div>

                <Link href={`/projects/${project.id}`}>
                  <Button size="sm" className="gap-1.5 text-xs">
                    {submission ? 'View Capstone Status' : 'Open Capstone Workspace'}{' '}
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
