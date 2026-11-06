import { getUser } from '@/lib/utils/auth'
import {
  getPublishedModules,
  getAllPublishedLessons,
  getStudentLessonProgress,
} from '@/lib/content/get-content'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, CheckCircle2, Clock, ArrowRight, Lock } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function LearnOverviewPage() {
  const user = await getUser()
  const isAdmin =
    user?.user_metadata?.role === 'admin' || user?.user_metadata?.role === 'instructor'

  // Safely fetch modules with parts and lessons
  const modules = await getPublishedModules()

  // Safely fetch ordered lessons & student progress
  const allLessons = await getAllPublishedLessons()
  const progress = await getStudentLessonProgress(user?.id || '')

  const completedLessonIds = new Set(
    progress
      ?.filter((p: any) => p.status === 'completed')
      .map((p: any) => p.lesson_id) || []
  )

  // Determine sequential unlock state across the curriculum
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

  // Find first uncompleted and unlocked lesson for resume
  const firstUncompletedLesson = allLessons.find(
    (l: any) => !completedLessonIds.has(l.id) && unlockedLessonIds.has(l.id)
  )

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
              CHRMP Master Syllabus
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              14 Applied Curriculum Days
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Curriculum Workspace
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Access daily coursework modules, hospital operational case files, and statutory compliance frameworks.
          </p>
        </div>

        {firstUncompletedLesson && (
          <Link href={`/learn/${firstUncompletedLesson.id}`}>
            <Button className="gap-2 shadow-xs font-semibold">
              <BookOpen className="h-4 w-4" /> Resume: {firstUncompletedLesson.title.split(':')[0] || 'Next Unit'}
            </Button>
          </Link>
        )}
      </div>

      {(!modules || modules.length === 0) ? (
        <Card className="border border-border shadow-xs p-8 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <BookOpen className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-base text-foreground">No Published Lessons Yet</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Curriculum modules are currently being prepared or ingested by administrators. Check back shortly!
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {modules.map((module: any) => (
            <Card key={module.id} className="border border-border shadow-xs rounded-xl overflow-hidden">
              <CardHeader className="bg-muted/30 border-b border-border/60 pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-primary border-primary/25 bg-primary/10 font-mono font-semibold text-[10px]">
                    Module {module.order_index}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    {module.parts?.reduce(
                      (acc: number, p: { lessons: unknown[] }) => acc + (p.lessons?.length || 0),
                      0
                    ) || 0}{' '}
                    Curriculum Units
                  </span>
                </div>
                <CardTitle className="font-serif text-xl sm:text-2xl font-bold text-foreground mt-1">
                  {module.title}
                </CardTitle>
                <CardDescription className="text-xs leading-relaxed text-muted-foreground font-sans">
                  {module.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {module.parts?.map(
                  (part: {
                    id: string
                    title: string
                    lessons: Array<{
                      id: string
                      title: string
                      estimated_minutes: number
                      summary: string
                    }>
                  }) => (
                    <div key={part.id} className="space-y-3">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-1.5 flex items-center justify-between">
                        <span>{part.title}</span>
                        <span className="text-[10px] text-muted-foreground/80 font-normal font-mono">
                          {part.lessons?.length || 0} Lessons
                        </span>
                      </h4>
                      <div className="space-y-2">
                        {part.lessons?.map((lesson) => {
                          const isCompleted = completedLessonIds.has(lesson.id)
                          const isUnlocked = unlockedLessonIds.has(lesson.id)

                          return (
                            <div
                              key={lesson.id}
                              className={`flex items-center justify-between p-3.5 rounded-lg border transition-colors ${
                                isUnlocked
                                  ? 'border-border bg-card hover:bg-muted/40'
                                  : 'border-border/40 bg-muted/20 opacity-60'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {isCompleted ? (
                                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                ) : isUnlocked ? (
                                  <div className="h-4 w-4 rounded-full border-2 border-primary bg-primary/20 shrink-0 flex items-center justify-center">
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                  </div>
                                ) : (
                                  <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                                )}
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h5 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                                      {lesson.title}
                                    </h5>
                                    {!isUnlocked && (
                                      <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                                        Locked
                                      </span>
                                    )}
                                    {isUnlocked && !isCompleted && (
                                      <span className="text-[10px] text-primary font-semibold bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                                        Available
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-muted-foreground truncate">
                                    {lesson.summary || 'Core educational concepts and frameworks.'}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 shrink-0">
                                <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono">
                                  <Clock className="h-3 w-3" /> {lesson.estimated_minutes || 20}m
                                </span>

                                {isUnlocked ? (
                                  <Link href={`/learn/${lesson.id}`}>
                                    <Button
                                      size="sm"
                                      variant={isCompleted ? 'outline' : 'default'}
                                      className="h-7 text-xs gap-1 font-semibold"
                                    >
                                      {isCompleted ? 'Review' : 'Start'}{' '}
                                      <ArrowRight className="h-3 w-3" />
                                    </Button>
                                  </Link>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled
                                    className="h-7 text-xs gap-1 opacity-50 cursor-not-allowed border-dashed"
                                  >
                                    <Lock className="h-3 w-3" /> Locked
                                  </Button>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
