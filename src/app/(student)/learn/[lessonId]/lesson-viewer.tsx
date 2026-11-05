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
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface LessonContentBlock {
  type: string
  data: Record<string, unknown>
}

export function LessonViewer({
  lesson,
  isCompletedInitially,
  nextLessonId,
  prevLessonId,
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
  prevLessonId: string | null
}) {
  const [completed, setCompleted] = useState(isCompletedInitially)
  const [submitting, setSubmitting] = useState(false)
  const [aiModalOpen, setAiModalOpen] = useState(false)
  const router = useRouter()

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
            className="gap-1.5 text-xs text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
          >
            <Sparkles className="h-3.5 w-3.5" /> Ask AI Tutor
          </Button>

          <Button
            size="sm"
            onClick={handleMarkComplete}
            disabled={submitting}
            className={`gap-1.5 text-xs ${
              completed
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-primary text-primary-foreground'
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
              <div key={idx} className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/5 text-xs sm:text-sm my-4 space-y-1">
                {title && <h5 className="font-bold text-amber-700 dark:text-amber-300">{title}</h5>}
                {text && <p className="text-foreground/90 leading-relaxed">{text}</p>}
              </div>
            )
          }

          if (block.type === 'table') {
            const headers = (block.data?.headers as string[]) || []
            const rows = (block.data?.rows as string[][]) || []
            return (
              <div key={idx} className="overflow-x-auto my-6 border border-border/80 rounded-xl shadow-xs">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  {headers.length > 0 && (
                    <thead className="bg-muted/70 text-foreground font-semibold border-b border-border/80">
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
              <div key={idx} className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-xs sm:text-sm my-4">
                <span className="font-bold text-emerald-700 dark:text-emerald-300 block mb-1">
                  Practical Workplace Scenario:
                </span>
                <p className="text-emerald-900 dark:text-emerald-200 leading-relaxed">
                  {block.data?.text as string}
                </p>
              </div>
            )
          }

          return null
        })}
      </article>

      {/* Bottom Navigation */}
      <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        {prevLessonId ? (
          <Link href={`/learn/${prevLessonId}`}>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <ArrowLeft className="h-4 w-4" /> Previous Lesson
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
            className={`gap-1.5 text-xs ${
              completed
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-primary text-primary-foreground'
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
                Complete Lesson & Continue <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </Button>

          {nextLessonId && (
            <Link href={`/learn/${nextLessonId}`}>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
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

