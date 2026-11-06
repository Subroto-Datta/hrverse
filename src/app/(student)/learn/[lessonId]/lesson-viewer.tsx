'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { completeLesson } from '@/actions/learning'
import { AIAssistantModal } from '@/components/layout/ai-assistant-modal'
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Clock,
  BookOpen,
  HelpCircle,
  Loader2,
  Lock,
  Compass,
  FileText,
  Bookmark,
  Layers,
  Award,
  ListChecks,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  InteractiveCalculator,
  ProcessSteps,
  ComparisonMatrix,
  InteractiveCheckpoint,
  InteractiveChecklist,
  DepartmentMap,
  AssignmentCard,
  TakeawayBanner,
  StatsGrid,
} from '@/components/course/visual-blocks'

interface LessonContentBlock {
  type: string
  data: Record<string, unknown>
}

export function LessonViewer({
  lesson,
  isCompletedInitially,
  nextLessonId,
  nextLessonTitle,
  prevLessonId,
  prevLessonTitle,
  dayIndex,
  totalLessons,
}: {
  lesson: {
    id: string
    title: string
    summary: string | null
    estimated_minutes: number
    content: { blocks?: LessonContentBlock[] } | string
  }
  isCompletedInitially: boolean
  nextLessonId: string | null
  nextLessonTitle?: string | null
  prevLessonId: string | null
  prevLessonTitle?: string | null
  dayIndex?: number
  totalLessons?: number
}) {
  const [completed, setCompleted] = useState(isCompletedInitially)
  const [submitting, setSubmitting] = useState(false)
  const [aiModalOpen, setAiModalOpen] = useState(false)
  const [activeSectionId, setActiveSectionId] = useState<string>('')
  const router = useRouter()

  // Parse blocks
  let blocks: LessonContentBlock[] = []
  if (typeof lesson.content === 'object' && lesson.content?.blocks) {
    blocks = lesson.content.blocks
  } else if (typeof lesson.content === 'string') {
    try {
      const parsed = JSON.parse(lesson.content)
      blocks = parsed.blocks || []
    } catch {
      blocks = [{ type: 'paragraph', data: { text: lesson.content } }]
    }
  }

  // Count interaction targets
  const checkpointBlocks = blocks.filter((b) => b.type === 'checkpoint')
  const checklistBlocks = blocks.filter((b) => b.type === 'checklist')
  const [answeredCheckpoints, setAnsweredCheckpoints] = useState<number>(0)
  const [checklistComplete, setChecklistComplete] = useState<boolean>(checklistBlocks.length === 0)

  // Extract syllabus navigation items from headers, checkpoints, and assignments
  const syllabusItems = blocks
    .map((b, idx) => {
      if (b.type === 'header') {
        const level = (b.data?.level as number) || 2
        const text = ((b.data?.text as string) || '').trim()
        if (!text) return null
        return {
          id: `section-${idx}`,
          idx,
          type: 'header',
          level,
          label: text,
        }
      }
      if (b.type === 'checkpoint') {
        const q = (b.data?.question as string) || 'Situational Checkpoint'
        return {
          id: `section-${idx}`,
          idx,
          type: 'checkpoint',
          level: 2,
          label: `Checkpoint: ${q.length > 40 ? q.slice(0, 40) + '...' : q}`,
        }
      }
      if (b.type === 'assignment') {
        const title = (b.data?.title as string) || 'Practical Deliverable'
        return {
          id: `section-${idx}`,
          idx,
          type: 'assignment',
          level: 2,
          label: `Project: ${title.length > 40 ? title.slice(0, 40) + '...' : title}`,
        }
      }
      return null
    })
    .filter(Boolean) as Array<{ id: string; idx: number; type: string; level: number; label: string }>

  const scrollToSection = (id: string) => {
    setActiveSectionId(id)
    const el = document.getElementById(id)
    if (el) {
      const yOffset = -80
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const handleMarkComplete = async () => {
    setSubmitting(true)
    try {
      await completeLesson(lesson.id, (lesson.estimated_minutes || 15) * 60)
      setCompleted(true)
      if (nextLessonId) {
        router.push(`/learn/${nextLessonId}`)
      }
    } catch (err) {
      console.error('Error completing lesson:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link href="/learn">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Curriculum Roadmap
            </Button>
          </Link>
          <span className="text-muted-foreground/40">•</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
            <Clock className="h-3.5 w-3.5" /> {lesson.estimated_minutes || 20} min curriculum read
          </span>
          {dayIndex && (
            <>
              <span className="text-muted-foreground/40">•</span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-semibold">
                Day {dayIndex} of {totalLessons || 14}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAiModalOpen(true)}
            className="gap-2 text-xs border-border bg-card hover:bg-muted text-foreground transition-all"
          >
            <Compass className="h-3.5 w-3.5 text-primary" /> Faculty Office Hours
          </Button>

          <Button
            size="sm"
            onClick={handleMarkComplete}
            disabled={submitting}
            className={`gap-1.5 text-xs font-semibold ${
              completed
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-primary text-primary-foreground shadow-xs transition-all'
            }`}
          >
            {submitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : completed ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" /> Day Completed
              </>
            ) : (
              <>
                Mark Complete & Next <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Studio 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)] gap-10 items-start">
        {/* Sticky Left Syllabus Rail */}
        <aside className="hidden lg:block sticky top-6 space-y-5 border-r border-border/70 pr-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="space-y-1">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
              Lesson Syllabus
            </p>
            <h4 className="text-xs font-bold text-foreground">
              Coursework Navigator
            </h4>
          </div>

          {/* Quick Progress Indicator */}
          <div className="p-3 rounded-lg border border-border bg-muted/30 space-y-2 text-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground font-medium">Status</span>
              <span className={completed ? 'text-emerald-500 font-bold' : 'text-primary font-bold'}>
                {completed ? 'Verified ✓' : 'In Progress'}
              </span>
            </div>
            {checkpointBlocks.length > 0 && (
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Checkpoints</span>
                <span className="font-mono font-semibold text-foreground">
                  {completed ? checkpointBlocks.length : answeredCheckpoints}/{checkpointBlocks.length}
                </span>
              </div>
            )}
            {checklistBlocks.length > 0 && (
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Checklist</span>
                <span className="font-semibold text-foreground">
                  {checklistComplete || completed ? 'Satisfied ✓' : 'Pending'}
                </span>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            {syllabusItems.slice(0, 18).map((item) => {
              const isHeader1 = item.type === 'header' && item.level === 1
              const isCheckpoint = item.type === 'checkpoint'
              const isAssignment = item.type === 'assignment'

              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left py-1.5 px-2 rounded-md transition-colors leading-snug truncate block ${
                    activeSectionId === item.id
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  } ${isHeader1 ? 'font-bold text-foreground text-xs pt-3 border-t border-border/40 first:border-0 first:pt-1' : 'pl-3 text-[11px]'}`}
                  title={item.label}
                >
                  {isCheckpoint ? (
                    <span className="flex items-center gap-1.5 text-primary">
                      <HelpCircle className="h-3 w-3 shrink-0" /> {item.label}
                    </span>
                  ) : isAssignment ? (
                    <span className="flex items-center gap-1.5 text-primary">
                      <Award className="h-3 w-3 shrink-0" /> {item.label}
                    </span>
                  ) : (
                    item.label
                  )}
                </button>
              )
            })}
          </nav>

          <div className="pt-3 border-t border-border">
            <button
              onClick={() => setAiModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium border border-border bg-card hover:bg-muted text-foreground transition-all"
            >
              <Compass className="h-3.5 w-3.5 text-primary" />
              <span>Ask Faculty Advisor</span>
            </button>
          </div>
        </aside>

        {/* Right Content Studio Canvas */}
        <main className="min-w-0 max-w-3xl space-y-8">
          {/* Editorial Lesson Header */}
          <header className="space-y-3 pb-6 border-b border-border/70">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                CHRMP Core Curriculum
              </span>
              {dayIndex && (
                <span className="text-xs text-muted-foreground font-mono">
                  Module Unit #{dayIndex}
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
              {lesson.title}
            </h1>

            {lesson.summary && (
              <p className="font-serif text-base text-muted-foreground leading-relaxed italic border-l-2 border-primary/60 pl-4 py-1">
                {lesson.summary}
              </p>
            )}
          </header>

          {/* Lesson Body Content Blocks */}
          <article className="space-y-6">
            {blocks.map((block, idx) => {
              const blockId = `section-${idx}`

              if (block.type === 'header') {
                const level = (block.data?.level as number) || 2
                const text = block.data?.text as string

                if (level === 1) {
                  return (
                    <h2
                      id={blockId}
                      key={idx}
                      className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground border-b border-border/80 pb-2.5 mt-10 mb-4 scroll-mt-20"
                    >
                      {text}
                    </h2>
                  )
                }
                if (level === 2) {
                  return (
                    <h3
                      id={blockId}
                      key={idx}
                      className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-8 mb-3 flex items-center gap-2 scroll-mt-20"
                    >
                      <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                      <span>{text}</span>
                    </h3>
                  )
                }
                return (
                  <h4
                    id={blockId}
                    key={idx}
                    className="text-xs uppercase tracking-wider font-bold text-primary mt-6 mb-2 scroll-mt-20"
                  >
                    {text}
                  </h4>
                )
              }

              if (block.type === 'paragraph') {
                return (
                  <p key={idx} className="text-sm sm:text-base leading-relaxed text-foreground/90 font-normal">
                    {block.data?.text as string}
                  </p>
                )
              }

              if (block.type === 'callout') {
                const title = block.data?.title as string
                const text = block.data?.text as string
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-xl border-l-4 border-primary border-y border-r border-border/70 bg-muted/40 my-6 space-y-1.5"
                  >
                    {title && (
                      <h5 className="font-serif font-bold text-sm text-foreground tracking-tight flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" /> {title}
                      </h5>
                    )}
                    {text && <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">{text}</p>}
                  </div>
                )
              }

              if (block.type === 'table') {
                const headers = (block.data?.headers as string[]) || []
                const rows = (block.data?.rows as string[][]) || []
                return (
                  <div key={idx} className="overflow-x-auto my-6 border border-border/80 rounded-xl shadow-xs bg-card">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse">
                      {headers.length > 0 && (
                        <thead className="bg-muted/60 text-foreground font-semibold border-b border-border/80">
                          <tr>
                            {headers.map((h, hIdx) => (
                              <th key={hIdx} className="px-4 py-3 font-serif font-bold tracking-wide">{h}</th>
                            ))}
                          </tr>
                        </thead>
                      )}
                      <tbody className="divide-y divide-border/60">
                        {rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-muted/30 transition-colors">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="px-4 py-3 text-foreground/90 leading-relaxed">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              }

              if (block.type === 'list') {
                const items = (block.data?.items as string[]) || []
                const isOrdered = block.data?.style === 'ordered'

                if (isOrdered) {
                  return (
                    <ol key={idx} className="list-decimal pl-6 space-y-2 text-sm leading-relaxed text-foreground/90">
                      {items.map((item, iIdx) => (
                        <li key={iIdx}>{item}</li>
                      ))}
                    </ol>
                  )
                }
                return (
                  <ul key={idx} className="list-disc pl-6 space-y-2 text-sm leading-relaxed text-foreground/90">
                    {items.map((item, iIdx) => (
                      <li key={iIdx}>{item}</li>
                    ))}
                  </ul>
                )
              }

              if (block.type === 'example') {
                return (
                  <div key={idx} className="p-5 rounded-xl border border-border bg-card my-6 space-y-2">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-primary flex items-center gap-1.5">
                        <Bookmark className="h-3 w-3" /> Workplace Case Vignette
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase font-medium">Applied Practice</span>
                    </div>
                    <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed pt-1">
                      {block.data?.text as string}
                    </p>
                  </div>
                )
              }

              if (block.type === 'calculator') {
                return (
                  <div key={idx} className="not-prose my-6">
                    <InteractiveCalculator
                      type={(block.data?.calculatorType as any) || 'attrition_rate'}
                      title={(block.data?.title as string) || 'Metric Calculator'}
                      description={block.data?.description as string}
                      defaultValues={block.data?.defaultValues as any}
                    />
                  </div>
                )
              }

              if (block.type === 'process_steps') {
                return (
                  <div key={idx} className="not-prose my-6">
                    <ProcessSteps
                      title={block.data?.title as string}
                      subtitle={block.data?.subtitle as string}
                      steps={(block.data?.steps as any) || []}
                    />
                  </div>
                )
              }

              if (block.type === 'comparison_matrix') {
                return (
                  <div key={idx} className="not-prose my-6">
                    <ComparisonMatrix
                      title={block.data?.title as string}
                      subtitle={block.data?.subtitle as string}
                      items={(block.data?.items as any) || []}
                    />
                  </div>
                )
              }

              if (block.type === 'checkpoint') {
                return (
                  <div id={blockId} key={idx} className="not-prose my-6 scroll-mt-20">
                    <InteractiveCheckpoint
                      question={block.data?.question as string}
                      scenario={block.data?.scenario as string}
                      options={(block.data?.options as string[]) || []}
                      correctOptionIndex={(block.data?.correctOptionIndex as number) || 0}
                      explanation={block.data?.explanation as string}
                      mentorTip={block.data?.mentorTip as string}
                      onAnswer={() => {
                        setAnsweredCheckpoints((prev) => Math.min(checkpointBlocks.length, prev + 1))
                      }}
                    />
                  </div>
                )
              }

              if (block.type === 'checklist') {
                return (
                  <div key={idx} className="not-prose my-6">
                    <InteractiveChecklist
                      title={block.data?.title as string}
                      subtitle={block.data?.subtitle as string}
                      items={(block.data?.items as string[]) || []}
                      onCompleteChange={(isDone) => {
                        setChecklistComplete(isDone)
                      }}
                    />
                  </div>
                )
              }

              if (block.type === 'department_map') {
                return (
                  <div key={idx} className="not-prose my-6">
                    <DepartmentMap
                      title={block.data?.title as string}
                      departments={(block.data?.departments as any) || []}
                    />
                  </div>
                )
              }

              if (block.type === 'assignment') {
                return (
                  <div id={blockId} key={idx} className="not-prose my-6 scroll-mt-20">
                    <AssignmentCard
                      title={block.data?.title as string}
                      durationMinutes={block.data?.durationMinutes as number}
                      objective={block.data?.objective as string}
                      tasks={(block.data?.tasks as string[]) || []}
                      submissionFormat={block.data?.submissionFormat as string}
                    />
                  </div>
                )
              }

              if (block.type === 'takeaway') {
                return (
                  <div key={idx} className="not-prose my-6">
                    <TakeawayBanner
                      quote={block.data?.quote as string}
                      author={block.data?.author as string}
                      tag={block.data?.tag as string}
                    />
                  </div>
                )
              }

              if (block.type === 'stats') {
                return (
                  <div key={idx} className="not-prose my-6">
                    <StatsGrid
                      stats={(block.data?.stats as any) || []}
                    />
                  </div>
                )
              }

              if (block.type === 'divider') {
                return <hr key={idx} className="my-8 border-border/60" />
              }

              if (block.type === 'quote') {
                return (
                  <blockquote key={idx} className="border-l-4 border-primary pl-4 font-serif italic text-muted-foreground my-4 text-base">
                    {block.data?.text as string}
                  </blockquote>
                )
              }

              if (block.data?.text && typeof block.data.text === 'string') {
                return (
                  <p key={idx} className="text-sm sm:text-base leading-relaxed text-foreground/90 font-normal">
                    {block.data.text}
                  </p>
                )
              }

              return null
            })}
          </article>

          {/* Interaction Requirements Card */}
          <div
            className={`p-5 rounded-xl border transition-all ${
              completed
                ? 'border-emerald-500/30 bg-emerald-500/[0.04]'
                : 'border-border bg-card shadow-xs'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {completed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  ) : (
                    <ListChecks className="h-4 w-4 text-primary shrink-0" />
                  )}
                  <span className="text-xs font-bold text-foreground font-serif">
                    {completed
                      ? 'Curriculum Verification Satisfied'
                      : 'Curriculum Progression Status'}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {completed
                    ? 'All coursework, practical scenarios, and operational checks completed. Next unit unlocked!'
                    : 'Review coursework and interact with practical scenarios to unlock the subsequent day in sequence.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                {checkpointBlocks.length > 0 && (
                  <span
                    className={`px-2.5 py-1 rounded-md border font-mono ${
                      answeredCheckpoints >= checkpointBlocks.length || completed
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                        : 'border-border bg-muted/50 text-muted-foreground'
                    }`}
                  >
                    Checkpoints:{' '}
                    {completed ? checkpointBlocks.length : answeredCheckpoints}/
                    {checkpointBlocks.length}
                  </span>
                )}
                {checklistBlocks.length > 0 && (
                  <span
                    className={`px-2.5 py-1 rounded-md border font-mono ${
                      checklistComplete || completed
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                        : 'border-border bg-muted/50 text-muted-foreground'
                    }`}
                  >
                    Checklist: {checklistComplete || completed ? 'Verified ✓' : 'Pending'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            {prevLessonId ? (
              <Link href={`/learn/${prevLessonId}`}>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <ArrowLeft className="h-4 w-4" />{' '}
                  {prevLessonTitle
                    ? prevLessonTitle.length > 25
                      ? prevLessonTitle.slice(0, 25) + '...'
                      : prevLessonTitle
                    : 'Previous Day'}
                </Button>
              </Link>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              <Button
                size="sm"
                onClick={handleMarkComplete}
                disabled={submitting}
                className={`gap-1.5 text-xs font-semibold ${
                  completed
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-primary text-primary-foreground shadow-xs'
                }`}
              >
                {submitting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : completed ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                  </>
                ) : (
                  <>
                    Complete Lesson & Unlock Next <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>

              {nextLessonId && (
                completed ? (
                  <Link href={`/learn/${nextLessonId}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs border-primary/30 hover:border-primary hover:bg-primary/10 text-foreground transition-all shadow-xs"
                    >
                      Next:{' '}
                      {nextLessonTitle
                        ? nextLessonTitle.length > 24
                          ? nextLessonTitle.slice(0, 24) + '...'
                          : nextLessonTitle
                        : 'Next Day'}{' '}
                      <ArrowRight className="h-3.5 w-3.5 text-primary" />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="gap-1.5 text-xs opacity-50 cursor-not-allowed border-dashed text-muted-foreground"
                    title="Complete today's coursework to unlock the next day"
                  >
                    <Lock className="h-3.5 w-3.5" /> Next Day Locked
                  </Button>
                )
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Pre-scoped AI Modal for this Lesson */}
      <AIAssistantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        lessonTitle={lesson.title}
        lessonContent={typeof lesson.content === 'string' ? lesson.content : JSON.stringify(lesson.content)}
      />
    </div>
  )
}
