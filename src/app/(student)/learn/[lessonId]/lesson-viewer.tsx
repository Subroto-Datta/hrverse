'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { completeLesson } from '@/actions/learning'
import { AIAssistantModal } from '@/components/layout/ai-assistant-modal'
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Clock,
  BookOpen,
  HelpCircle,
  Loader2,
  Lock,
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
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              <ArrowLeft className="h-4 w-4" /> All Lessons
            </Button>
          </Link>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {lesson.estimated_minutes || 20} min read
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAiModalOpen(true)}
            className="gap-1.5 text-xs text-amber-700 dark:text-amber-300 border-amber-500/20 hover:border-amber-500/35 bg-amber-500/[0.04] hover:bg-amber-500/10 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Ask AI Tutor
          </Button>

          <Button
            size="sm"
            onClick={handleMarkComplete}
            disabled={submitting}
            className={`gap-1.5 text-xs font-semibold ${
              completed
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-primary text-primary-foreground shadow-xs hover:shadow-[0_0_18px_-3px_rgba(245,158,11,0.22)] transition-all'
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
                Mark Complete & Next <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Lesson Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {lesson.title}
        </h1>
        {lesson.summary && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {lesson.summary}
          </p>
        )}
      </div>

      {/* Lesson Body Content Blocks */}
      <article className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        {blocks.map((block, idx) => {
          if (block.type === 'header') {
            const level = (block.data?.level as number) || 2
            const text = block.data?.text as string
            if (level === 1) return <h2 key={idx} className="text-2xl font-bold tracking-tight text-foreground border-b border-border/60 pb-2 mt-8">{text}</h2>
            if (level === 2) return <h3 key={idx} className="text-xl font-bold tracking-tight text-foreground mt-6">{text}</h3>
            return <h4 key={idx} className="text-base font-semibold text-foreground mt-4">{text}</h4>
          }

          if (block.type === 'paragraph') {
            return (
              <p key={idx} className="text-sm sm:text-base leading-relaxed text-foreground/90">
                {block.data?.text as string}
              </p>
            )
          }

          if (block.type === 'callout') {
            const title = block.data?.title as string
            const text = block.data?.text as string
            return (
              <div key={idx} className="p-4.5 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] dark:bg-amber-500/[0.03] text-xs sm:text-sm my-5 space-y-1.5 shadow-[0_1px_10px_-3px_rgba(245,158,11,0.06)]">
                {title && <h5 className="font-semibold text-amber-700 dark:text-amber-300 tracking-tight">{title}</h5>}
                {text && <p className="text-foreground/90 leading-relaxed">{text}</p>}
              </div>
            )
          }

          if (block.type === 'table') {
            const headers = (block.data?.headers as string[]) || []
            const rows = (block.data?.rows as string[][]) || []
            return (
              <div key={idx} className="overflow-x-auto my-6 border border-border/70 rounded-xl shadow-xs bg-card">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  {headers.length > 0 && (
                    <thead className="bg-muted/50 text-foreground font-semibold border-b border-border/70">
                      <tr>
                        {headers.map((h, hIdx) => (
                          <th key={hIdx} className="px-4 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody className="divide-y divide-border/50">
                    {rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-muted/30 transition-colors">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-4 py-2.5 text-foreground/90">{cell}</td>
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
                <ol key={idx} className="list-decimal pl-6 space-y-1.5 text-sm sm:text-base text-foreground/90">
                  {items.map((item, iIdx) => (
                    <li key={iIdx}>{item}</li>
                  ))}
                </ol>
              )
            }
            return (
              <ul key={idx} className="list-disc pl-6 space-y-1.5 text-sm sm:text-base text-foreground/90">
                {items.map((item, iIdx) => (
                  <li key={iIdx}>{item}</li>
                ))}
              </ul>
            )
          }

          if (block.type === 'example') {
            return (
              <div key={idx} className="p-4.5 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.04] text-xs sm:text-sm my-5 space-y-1">
                <span className="font-bold text-emerald-700 dark:text-emerald-300 block">
                  Practical Workplace Scenario:
                </span>
                <p className="text-foreground/90 leading-relaxed">
                  {block.data?.text as string}
                </p>
              </div>
            )
          }

          if (block.type === 'calculator') {
            return (
              <div key={idx} className="not-prose">
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
              <div key={idx} className="not-prose">
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
              <div key={idx} className="not-prose">
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
              <div key={idx} className="not-prose">
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
              <div key={idx} className="not-prose">
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
              <div key={idx} className="not-prose">
                <DepartmentMap
                  title={block.data?.title as string}
                  departments={(block.data?.departments as any) || []}
                />
              </div>
            )
          }

          if (block.type === 'assignment') {
            return (
              <div key={idx} className="not-prose">
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
              <div key={idx} className="not-prose">
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
              <div key={idx} className="not-prose">
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
              <blockquote key={idx} className="border-l-4 border-amber-500 pl-4 italic text-muted-foreground my-4">
                {block.data?.text as string}
              </blockquote>
            )
          }

          // Graceful fallback: if block has text, render it so content is never lost
          if (block.data?.text && typeof block.data.text === 'string') {
            return (
              <p key={idx} className="text-sm sm:text-base leading-relaxed text-foreground/90">
                {block.data.text}
              </p>
            )
          }

          return null
        })}
      </article>

      {/* Interaction Requirements Card */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          completed
            ? 'border-emerald-500/30 bg-emerald-500/[0.04]'
            : 'border-border/80 bg-card shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {completed ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              ) : (
                <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
              )}
              <span className="text-xs font-bold text-foreground">
                {completed
                  ? 'Day Requirements Satisfied'
                  : 'Day Completion & Progression Status'}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {completed
                ? 'Coursework, practical interactions, and self-mastery checks completed. Next day unlocked!'
                : 'Review coursework and interact with checkpoint scenarios below to unlock the next day in sequence.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            {checkpointBlocks.length > 0 && (
              <span
                className={`px-2.5 py-1 rounded-lg border font-mono ${
                  answeredCheckpoints >= checkpointBlocks.length || completed
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    : 'border-border bg-muted/50 text-muted-foreground'
                }`}
              >
                Checkpoint:{' '}
                {completed ? checkpointBlocks.length : answeredCheckpoints}/
                {checkpointBlocks.length}
              </span>
            )}
            {checklistBlocks.length > 0 && (
              <span
                className={`px-2.5 py-1 rounded-lg border font-mono ${
                  checklistComplete || completed
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
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
                : 'bg-primary text-primary-foreground shadow-xs hover:shadow-[0_0_18px_-3px_rgba(245,158,11,0.22)]'
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
                  className="gap-1.5 text-xs border-amber-500/30 hover:border-amber-500 hover:bg-amber-500/10 text-foreground transition-all shadow-xs"
                >
                  Next:{' '}
                  {nextLessonTitle
                    ? nextLessonTitle.length > 24
                      ? nextLessonTitle.slice(0, 24) + '...'
                      : nextLessonTitle
                    : 'Next Day'}{' '}
                  <ArrowRight className="h-3.5 w-3.5 text-amber-500" />
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

