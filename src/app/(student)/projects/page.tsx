import { getUser } from '@/lib/utils/auth'
import {
  getPublishedProjects,
  getStudentProjectSubmissions,
} from '@/lib/content/get-content'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FolderKanban, CheckCircle2, Clock, ArrowRight } from 'lucide-react'

export default async function ProjectsOverviewPage() {
  const user = await getUser()

  // Safely fetch published projects
  const projects = await getPublishedProjects()

  // Safely fetch student submissions
  const submissions = await getStudentProjectSubmissions(user?.id || '')

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

      {(!projects || projects.length === 0) ? (
        <Card className="border border-border/80 shadow-sm p-8 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <FolderKanban className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-foreground">No Capstone Projects Active</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Capstone project briefs will unlock during the second half of the CHRMP curriculum.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {projects.map((project: any) => {
            const submission = submissions?.find((s: any) => s.project_id === project.id)
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
      )}
    </div>
  )
}
