'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { submitAssessment } from '@/actions/learning'
import {
  ClipboardCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowLeft,
  Loader2,
  Send,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'

interface RubricItem {
  criterion: string
  description: string
  max_points: number
}

export function AssessmentDetailClient({
  assessment,
  submission,
}: {
  assessment: {
    id: string
    title: string
    description: string
    instructions: string
    rubric: RubricItem[]
    max_score: number
  }
  submission: {
    id: string
    content: string
    file_urls: string[]
    score: number | null
    feedback: string | null
    status: string
    submitted_at: string | null
  } | null
}) {
  const [content, setContent] = useState(submission?.content || '')
  const [fileUrl, setFileUrl] = useState(submission?.file_urls?.[0] || '')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(Boolean(submission))
  const [errorMsg, setErrorMsg] = useState('')

  const isGraded = submission?.status === 'graded'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() && !fileUrl.trim()) {
      setErrorMsg('Please provide your strategy response or a deliverable document link.')
      return
    }

    setSubmitting(true)
    setErrorMsg('')
    try {
      await submitAssessment(
        assessment.id,
        content,
        fileUrl.trim() ? [fileUrl.trim()] : []
      )
      setSubmitted(true)
    } catch (err: unknown) {
      const error = err as Error
      setErrorMsg(error.message || 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <Link href="/assessments">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
            <ArrowLeft className="h-4 w-4" /> All Assessments
          </Button>
        </Link>
        <Badge variant="outline" className="text-xs">
          {assessment.max_score} Max Points
        </Badge>
      </div>

      {/* Assessment Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {assessment.title}
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {assessment.description}
        </p>
      </div>

      {/* Status Alert if Graded */}
      {isGraded && (
        <Card className="border-emerald-500/30 bg-emerald-500/10 shadow-sm">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                <CheckCircle2 className="h-5 w-5" />
                <span>Evaluation Complete: {submission?.score} / {assessment.max_score} Points</span>
              </div>
              <Badge className="bg-emerald-600 text-white">Graded</Badge>
            </div>
            {submission?.feedback && (
              <div className="p-4 rounded-lg bg-card border border-border/60 text-xs sm:text-sm text-foreground/90 space-y-1">
                <span className="font-semibold block text-foreground">Evaluator Feedback:</span>
                <p className="leading-relaxed whitespace-pre-wrap">{submission.feedback}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Prompt & Instructions */}
      <Card className="border border-border/80 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Case Instructions & Deliverable Prompt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-xs sm:text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
          {assessment.instructions ||
            'Read the case brief carefully. Structure your answer using the four strategic pillars: Talent Acquisition, Compensation & Compa-Ratios, Performance Systems & BARS, and Culture Architecture.'}
        </CardContent>
      </Card>

      {/* Rubric View */}
      {assessment.rubric && assessment.rubric.length > 0 && (
        <Card className="border border-border/80 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">Evaluation Rubric</CardTitle>
            <CardDescription className="text-xs">
              Your submission will be scored against these criteria:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border">
                  <tr>
                    <th className="p-3">Criterion</th>
                    <th className="p-3">Requirement</th>
                    <th className="p-3 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {assessment.rubric.map((r, idx) => (
                    <tr key={idx} className="hover:bg-muted/20">
                      <td className="p-3 font-semibold text-foreground">{r.criterion}</td>
                      <td className="p-3 text-muted-foreground">{r.description}</td>
                      <td className="p-3 text-right font-bold text-foreground">{r.max_points} pts</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submission Portal Form */}
      <Card className="border border-border/80 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">
            {isGraded ? 'Your Submitted Deliverable' : submitted ? 'Submission Received' : 'Submit Your Assessment'}
          </CardTitle>
          <CardDescription className="text-xs">
            {submitted
              ? 'Your work has been submitted to the evaluation queue.'
              : 'Compose your strategic analysis below or link your executive slides / report.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content" className="text-xs">
                Written Strategic Report / Analysis (Markdown Supported)
              </Label>
              <Textarea
                id="content"
                rows={12}
                disabled={isGraded}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Structure your executive roadmap here (Executive Summary, Pillar 1, Pillar 2, KPI Scorecard)..."
                className="text-xs sm:text-sm font-mono leading-relaxed"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileUrl" className="text-xs">
                External Deliverable Link (Google Docs, PDF URL, Figma, etc.)
              </Label>
              <Input
                id="fileUrl"
                type="url"
                disabled={isGraded}
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://docs.google.com/document/d/..."
                className="text-xs"
              />
            </div>

            {!isGraded && (
              <Button type="submit" disabled={submitting} className="gap-2 text-xs">
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> {submitted ? 'Update Submission' : 'Submit for Grading'}
                  </>
                )}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

