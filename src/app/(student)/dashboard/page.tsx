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
  Sparkles,
  HelpCircle,
  ClipboardCheck,
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
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Student Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Track your progress across the Certified Human Resource Management Professional (CHRMP) program.
          </p>
        </div>
        <Link href="/learn">
          <Button className="gap-2 shadow-sm">
            <BookOpen className="h-4 w-4" /> Continue Learning
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border/70 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Course Completion</p>
              <p className="text-2xl font-bold text-foreground">{progressPercent}%</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/70 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Lessons Completed</p>
              <p className="text-2xl font-bold text-foreground">
                {completedCount} <span className="text-xs text-muted-foreground font-normal">/ {totalLessons}</span>
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <BookOpen className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/70 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Quiz Average</p>
              <p className="text-2xl font-bold text-foreground">{quizAvg}%</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <HelpCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/70 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Target Certification</p>
              <p className="text-sm font-bold text-foreground truncate">CHRMP</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Active Course Progress & Next Actions */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-border/80 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-primary border-primary/20">
                  Active Enrollment
                </Badge>
                <span className="text-xs text-muted-foreground">Week 1 of 8</span>
              </div>
              <CardTitle className="text-lg font-bold mt-1">
                Certified Human Resource Management Professional (CHRMP)
              </CardTitle>
              <CardDescription className="text-xs">
                Next Topic: Talent Acquisition, Predictive Validity & STAR Interviewing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span>Overall Curriculum Progress</span>
                  <span>{progressPercent}%</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link href="/learn">
                  <Button size="sm" className="gap-1.5">
                    Launch Learning Workspace <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/roadmap">
                  <Button variant="outline" size="sm">
                    View Course Roadmap
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Tasks / Next Milestones */}
          <Card className="border border-border/80 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Upcoming Milestones & Quizzes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-lg border border-border/60 bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                    <HelpCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-foreground">Week 1 Comprehensive Quiz</h4>
                    <p className="text-[11px] text-muted-foreground">20 Questions • 70% Passing Threshold</p>
                  </div>
                </div>
                <Link href="/quizzes">
                  <Button size="sm" variant="outline" className="text-xs h-8">
                    Take Quiz
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-lg border border-border/60 bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                    <ClipboardCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-foreground">Assessment 1: Strategic HR Roadmap</h4>
                    <p className="text-[11px] text-muted-foreground">ApexLogix Technologies 12-Month Plan • 100 Pts</p>
                  </div>
                </div>
                <Link href="/assessments">
                  <Button size="sm" variant="outline" className="text-xs h-8">
                    View Brief
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: AI Tutor Card & Learning Activity Log */}
        <div className="space-y-6">
          {/* AI Helper Banner */}
          <Card className="border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-card shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                <Sparkles className="h-4 w-4" />
                <span>Need Guidance?</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your AI Learning Assistant is ready to explain complex formulas like compa-ratios, walk through BARS examples, or review assignment drafts.
              </p>
              <div className="p-2.5 bg-card/80 rounded-lg border border-border/50 text-[11px] text-muted-foreground">
                &ldquo;What is the difference between a job description and a job specification?&rdquo;
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="border border-border/80 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activities && activities.length > 0 ? (
                <div className="space-y-3 text-xs">
                  {activities.map((act: any) => (
                    <div key={act.id} className="flex items-center justify-between border-b border-border/40 pb-2">
                      <span className="capitalize font-medium text-foreground">
                        {act.activity_type.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(act.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No activity recorded yet. Start reading lessons in the Learning Workspace!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
