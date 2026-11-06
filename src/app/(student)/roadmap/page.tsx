import { getUser } from '@/lib/utils/auth'
import {
  getPublishedModules,
  getAllPublishedLessons,
  getStudentLessonProgress,
} from '@/lib/content/get-content'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2,
  Clock,
  BookOpen,
  HelpCircle,
  Lock,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function RoadmapPage() {
  const user = await getUser()
  const isAdmin =
    user?.user_metadata?.role === 'admin' || user?.user_metadata?.role === 'instructor'

  // Safely fetch modules with parts and lessons
  const modules = await getPublishedModules()
  const allLessons = await getAllPublishedLessons()

  // Safely fetch student lesson completions
  const progress = await getStudentLessonProgress(user?.id || '')
  const completedLessonIds = new Set(
    progress
      ?.filter((p: any) => p.status === 'completed')
      .map((p: any) => p.lesson_id) || []
  )

  // Determine sequential unlock state
  const unlockedLessonIds = new Set<string>()
  allLessons.forEach((l: any, idx: number) => {
    if (isAdmin || idx === 0) {
      unlockedLessonIds.add(l.id)
    } else {
      const prevLesson = allLessons[idx - 1]
      if (prevLesson && completedLessonIds.has(prevLesson.id)) {
        unlockedLessonIds.add(l.id)
      }
    }
  })

  const weeks = [
    {
      weekNum: 1,
      title: 'Week 1: Strategic Foundations & Talent Acquisition',
      desc: 'Evolution of HRM, Job Analysis (TDRs/KSAOs), Demand Forecasting, Multi-Channel Sourcing & Structured STAR Interviews.',
      moduleIndex: 1,
      quizTitle: 'Week 1 Comprehensive Quiz',
      status: 'active',
    },
    {
      weekNum: 2,
      title: 'Week 2: Total Rewards, Performance Architecture & ADDIE',
      desc: 'WorldatWork Framework, Point-Factor Job Evaluation, Salary Bands & Compa-Ratios, BARS/OKRs, Knowles Adult Learning.',
      moduleIndex: 2,
      quizTitle: 'Week 2 Comprehensive Quiz',
      status: 'upcoming',
    },
    {
      weekNum: 3,
      title: 'Week 3: Labor Relations, Compliance & Psychological Safety',
      desc: 'FLSA, EEO-1, 4/5ths Rule Adverse Impact Testing, Union Organizing, Progressive Discipline.',
      moduleIndex: null,
      quizTitle: 'Labor Law Diagnostic',
      status: 'upcoming',
    },
    {
      weekNum: 4,
      title: 'Week 4: Executive Long-Term Incentives & Equity Architecture',
      desc: 'RSUs, Stock Options, Vesting Cliffs, Pay Parity Regressions, Section 125 Benefits.',
      moduleIndex: null,
      quizTitle: 'Assessment 1 Submission',
      status: 'upcoming',
    },
    {
      weekNum: 5,
      title: 'Week 5: High-Performance Culture & 9-Box Succession',
      desc: '9-Box Performance vs. Potential Grid, 70-20-10 Learning Architecture, Executive Calibration, PIPs.',
      moduleIndex: null,
      quizTitle: 'Succession Simulation',
      status: 'upcoming',
    },
    {
      weekNum: 6,
      title: 'Week 6: Instructional Evaluation & Human Capital ROI',
      desc: 'Kirkpatrick Levels 1-4, Jack Phillips Level 5 ROI Formula, Microlearning, Communities of Practice.',
      moduleIndex: null,
      quizTitle: 'Assessment 2 Submission',
      status: 'upcoming',
    },
    {
      weekNum: 7,
      title: 'Week 7: People Analytics & Flight-Risk Modeling',
      desc: 'Talent Acquisition Metrics (QoH, TTF, CPH), Logistic Regression Attrition Models, Ethical AI Charters.',
      moduleIndex: null,
      quizTitle: 'Capstone 1 Submission',
      status: 'upcoming',
    },
    {
      weekNum: 8,
      title: 'Week 8: Digital HR Transformation & Final Board Defense',
      desc: 'Ulrich Operating Model, Enterprise HRIS Architecture (Workday, ATS, LMS), Final Certification Defense.',
      moduleIndex: null,
      quizTitle: 'Capstone 2 Defense',
      status: 'upcoming',
    },
  ]

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-5xl mx-auto">
      <div className="border-b border-border pb-6 space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Course Roadmap & Milestones
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Visual 8-week curriculum timeline for the Certified Human Resource Management Professional (CHRMP).
        </p>
      </div>

      {/* Timeline Flow */}
      <div className="relative pl-6 sm:pl-8 space-y-8 border-l-2 border-primary/20">
        {weeks.map((w, idx) => {
          const isCurrent = idx === 0
          const correspondingModule = modules?.find((m: any) => m.order_index === w.moduleIndex)

          return (
            <div key={idx} className="relative group">
              {/* Timeline Indicator Dot */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-1.5 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold border-2 transition-all ${
                  isCurrent
                    ? 'bg-primary text-primary-foreground border-primary shadow-md scale-110'
                    : 'bg-card text-muted-foreground border-border'
                }`}
              >
                {isCurrent ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
              </div>

              <Card
                className={`border transition-all ${
                  isCurrent
                    ? 'border-primary/50 shadow-md bg-card'
                    : 'border-border/60 bg-muted/10'
                }`}
              >
                <CardContent className="p-5 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-foreground">{w.title}</h3>
                        {isCurrent && (
                          <Badge variant="default" className="text-[10px] bg-primary text-primary-foreground">
                            Current Week
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{w.desc}</p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {isCurrent ? (
                        <Link href="/learn">
                          <Button size="sm" className="gap-1.5 text-xs h-8">
                            <BookOpen className="h-3.5 w-3.5" /> Study Now
                          </Button>
                        </Link>
                      ) : (
                        <Badge variant="secondary" className="text-[11px] gap-1">
                          <Lock className="h-3 w-3" /> Sequenced
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Lessons list if corresponding module exists */}
                  {correspondingModule && correspondingModule.parts && (
                    <div className="pt-3 border-t border-border/50 space-y-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Included Lessons:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {correspondingModule.parts.flatMap((part: { lessons: Array<{ id: string; title: string; slug: string }> }) =>
                          (part.lessons || []).map((lesson) => {
                            const isDone = completedLessonIds.has(lesson.id)
                            const isUnlocked = unlockedLessonIds.has(lesson.id)

                            if (!isUnlocked) {
                              return (
                                <div
                                  key={lesson.id}
                                  className="flex items-center gap-2 p-2 rounded-md bg-muted/20 text-xs text-muted-foreground/60 cursor-not-allowed opacity-60"
                                >
                                  <Lock className="h-3.5 w-3.5 shrink-0" />
                                  <span className="truncate">{lesson.title}</span>
                                </div>
                              )
                            }

                            return (
                              <Link
                                key={lesson.id}
                                href={`/learn/${lesson.id}`}
                                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/60 text-xs text-foreground group/link transition-colors"
                              >
                                {isDone ? (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                ) : (
                                  <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                                )}
                                <span className="truncate group-hover/link:text-primary transition-colors">
                                  {lesson.title}
                                </span>
                              </Link>
                            )
                          })
                        )}
                      </div>
                    </div>
                  )}

                  {/* Deliverable Pill with Week Completion Prerequisite */}
                  {(() => {
                    const moduleLessons = (correspondingModule?.parts || []).flatMap(
                      (p: any) => p.lessons || []
                    )
                    const isWeekCompleted =
                      isAdmin ||
                      (moduleLessons.length > 0 &&
                        moduleLessons.every((l: any) => completedLessonIds.has(l.id)))

                    if (isWeekCompleted) {
                      return (
                        <Link
                          href="/quizzes"
                          className="flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 p-2.5 rounded-md border border-emerald-500/25 hover:bg-emerald-500/20 transition-all group/deliv"
                        >
                          <span className="flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            <span>Deliverable: {w.quizTitle} (Unlocked)</span>
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 text-emerald-500 group-hover/deliv:translate-x-0.5 transition-transform" />
                        </Link>
                      )
                    }

                    return (
                      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground bg-muted/40 p-2.5 rounded-md">
                        <span className="flex items-center gap-2">
                          <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>Deliverable: {w.quizTitle} (Locked)</span>
                        </span>
                        <span className="text-[10px] text-muted-foreground/80 font-mono">
                          Finish Week to Unlock
                        </span>
                      </div>
                    )
                  })()}
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
