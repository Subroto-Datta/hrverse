import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/utils/auth'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, CheckCircle2, Clock, ArrowRight } from 'lucide-react'

export default async function LearnOverviewPage() {
  const user = await getUser()
  const supabase = await createClient()

  // Fetch modules, parts, and lessons
  const { data: modules } = await supabase
    .from('modules')
    .select('*, parts(*, lessons(*))')
    .eq('is_published', true)
    .order('order_index', { ascending: true })

  // Fetch lesson progress
  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('lesson_id, status')
    .eq('student_id', user?.id || '')
    .eq('status', 'completed')

  const completedLessonIds = new Set(progress?.map((p) => p.lesson_id) || [])

  // Find first uncompleted lesson
  let firstUncompletedLessonId: string | null = null
  if (modules) {
    for (const m of modules) {
      for (const p of m.parts || []) {
        for (const l of p.lessons || []) {
          if (!completedLessonIds.has(l.id)) {
            firstUncompletedLessonId = l.id
            break
          }
        }
        if (firstUncompletedLessonId) break
      }
      if (firstUncompletedLessonId) break
    }
  }

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Learning Workspace
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Access curriculum lessons, interactive study blocks, and case studies.
          </p>
        </div>

        {firstUncompletedLessonId && (
          <Link href={`/learn/${firstUncompletedLessonId}`}>
            <Button className="gap-2 shadow-sm">
              <BookOpen className="h-4 w-4" /> Resume Next Lesson
            </Button>
          </Link>
        )}
      </div>

      <div className="space-y-6">
        {modules?.map((module) => (
          <Card key={module.id} className="border border-border/80 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-primary border-primary/20">
                  Module {module.order_index}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {module.parts?.reduce((acc: number, p: { lessons: unknown[] }) => acc + (p.lessons?.length || 0), 0) || 0} Lessons
                </span>
              </div>
              <CardTitle className="text-lg font-bold text-foreground mt-1">
                {module.title}
              </CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                {module.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {module.parts?.map((part: { id: string; title: string; lessons: Array<{ id: string; title: string; estimated_minutes: number; summary: string }> }) => (
                <div key={part.id} className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-1.5">
                    {part.title}
                  </h4>
                  <div className="space-y-2">
                    {part.lessons?.map((lesson) => {
                      const isCompleted = completedLessonIds.has(lesson.id)

                      return (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-3.5 rounded-lg border border-border/60 hover:border-primary/40 bg-card hover:bg-muted/20 transition-all group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {isCompleted ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                            ) : (
                              <div className="h-4 w-4 rounded-full border-2 border-muted-foreground shrink-0" />
                            )}
                            <div className="min-w-0">
                              <h5 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                                {lesson.title}
                              </h5>
                              <p className="text-[11px] text-muted-foreground truncate">
                                {lesson.summary || 'Core educational concepts and frameworks.'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {lesson.estimated_minutes || 20}m
                            </span>
                            <Link href={`/learn/${lesson.id}`}>
                              <Button size="sm" variant={isCompleted ? 'outline' : 'default'} className="h-7 text-xs gap-1">
                                {isCompleted ? 'Review' : 'Start'} <ArrowRight className="h-3 w-3" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

