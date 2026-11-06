import { getUser } from '@/lib/utils/auth'
import {
  getStudentEnrollment,
  getStudentLessonProgress,
  getStudentQuizAttempts,
  getStudentLearningActivities,
  getTotalPublishedLessonsCount,
} from '@/lib/content/get-content'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  ArrowRight,
  HelpCircle,
  ClipboardCheck,
  Compass,
  FileText,
  ShieldCheck,
} from 'lucide-react'

export default async function StudentDashboardPage() {
  const user = await getUser()
  const studentId = user?.id || ''

  // Safely fetch data
  const enrollment = await getStudentEnrollment(studentId)
  const progress = await getStudentLessonProgress(studentId)
  const attempts = await getStudentQuizAttempts(studentId)
  const activities = await getStudentLearningActivities(studentId, 5)
  const totalLessons = await getTotalPublishedLessonsCount()

  const completedCount = progress.filter((p: any) => p.status === 'completed').length
  const progressPercent =
    totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 0

  const quizAvg =
    attempts && attempts.length > 0
      ? Math.round(
          attempts.reduce((a: number, b: any) => a + Number(b.percentage || 0), 0) /
            attempts.length
        )
      : 0

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Executive Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
              Fellowship Cohort 2026
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              Candidate: {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Enrolled Fellow'}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Executive Command Center
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Certified Human Resource Management Professional (CHRMP) Applied Leadership Curriculum.
          </p>
        </div>

        <Link href="/learn">
          <Button className="gap-2 shadow-xs font-semibold">
            <BookOpen className="h-4 w-4" /> Continue Curriculum <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Metrics Row (Executive Scorecard) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Curriculum Progress</p>
              <p className="font-serif text-3xl font-bold text-foreground">{progressPercent}%</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Completed Units</p>
              <p className="font-serif text-3xl font-bold text-foreground">
                {completedCount} <span className="text-xs text-muted-foreground font-sans font-normal">/ {totalLessons}</span>
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <BookOpen className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Assessment Average</p>
              <p className="font-serif text-3xl font-bold text-foreground">{quizAvg}%</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <HelpCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Accreditation</p>
              <p className="text-base font-bold text-foreground font-serif">CHRMP Fellow</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Active Course Progress & Next Actions */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-border shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60 bg-muted/20">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10 font-semibold text-[10px]">
                  Accredited Program
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">14 Curriculum Units Available</span>
              </div>
              <CardTitle className="font-serif text-xl sm:text-2xl font-bold mt-1 text-foreground">
                Certified Human Resource Management Professional (CHRMP)
              </CardTitle>
              <CardDescription className="text-xs">
                Active Module: Recruitment, Talent Acquisition, Job Architecture & Hospital Operations
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">Mastery Milestones Completed</span>
                  <span className="font-mono font-bold text-foreground">{progressPercent}%</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link href="/learn">
                  <Button size="sm" className="gap-2 font-semibold">
                    Launch Learning Workspace <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/roadmap">
                  <Button variant="outline" size="sm">
                    View Complete Syllabus
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Tasks / Next Milestones */}
          <Card className="border border-border shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="font-serif text-lg font-bold">Upcoming Credential Evaluations</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <HelpCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Week 1 Comprehensive Assessment</h4>
                    <p className="text-[11px] text-muted-foreground">50 Marks • 75 Mins • 70% Passing Threshold</p>
                  </div>
                </div>
                <Link href="/quizzes">
                  <Button size="sm" variant="outline" className="text-xs h-8">
                    View Assessment
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <ClipboardCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Capstone Project: 200-Bed Hospital Framework</h4>
                    <p className="text-[11px] text-muted-foreground">7 Deliverables • 13 Departmental Vacancies • 100 Pts Rubric</p>
                  </div>
                </div>
                <Link href="/projects">
                  <Button size="sm" variant="outline" className="text-xs h-8">
                    View Brief
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Faculty Advisor & Activity Log */}
        <div className="space-y-6">
          {/* Faculty Advisory Card */}
          <Card className="border border-border bg-muted/30 shadow-xs">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-foreground font-serif font-bold text-base">
                <Compass className="h-5 w-5 text-primary" />
                <span>Director&apos;s Advisory Desk</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Consult senior faculty guidance on hospital staffing ratios, statutory labor bylaws, ATS screening formulas, or capstone project deliverables.
              </p>
              <div className="p-3 bg-card rounded-lg border border-border text-[11px] text-muted-foreground font-serif italic">
                &ldquo;What is the critical difference between Job Description (JD) and Job Specification (JS) during hospital accreditation audits?&rdquo;
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="border border-border shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="font-serif text-base font-bold flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" /> Learning Log
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {activities && activities.length > 0 ? (
                <div className="space-y-2.5 text-xs">
                  {activities.map((act: any) => (
                    <div key={act.id} className="flex items-center justify-between border-b border-border/40 pb-2">
                      <span className="capitalize font-medium text-foreground">
                        {act.activity_type.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {new Date(act.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No activity recorded yet. Launch Day 1 in the Learning Workspace!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
