'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { submitProject } from '@/actions/learning'
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Loader2,
  Send,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'
import Link from 'next/link'

interface RubricItem {
  criterion: string
  description: string
  max_points: number
}

export function ProjectDetailClient({
  project,
  submission,
}: {
  project: {
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
    repository_url: string | null
    score: number | null
    feedback: string | null
    status: string
  } | null
}) {
  const [content, setContent] = useState(submission?.content || '')
  const [fileUrl, setFileUrl] = useState(submission?.file_urls?.[0] || '')
  const [repoUrl, setRepoUrl] = useState(submission?.repository_url || '')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(Boolean(submission))
  const [errorMsg, setErrorMsg] = useState('')

  const isGraded = submission?.status === 'graded'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() && !fileUrl.trim() && !repoUrl.trim()) {
      setErrorMsg('Please provide your capstone report text, deliverable URL, or repository link.')
      return
    }

    setSubmitting(true)
    setErrorMsg('')
    try {
      await submitProject(
        project.id,
        content,
        fileUrl.trim() ? [fileUrl.trim()] : [],
        repoUrl.trim() || undefined
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
        <Link href="/projects">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
            <ArrowLeft className="h-4 w-4" /> All Capstone Projects
          </Button>
        </Link>
        <Badge variant="outline" className="text-xs">
          {project.max_score} Max Points
        </Badge>
      </div>

      {/* Project Title */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {project.title}
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Graded Alert */}
      {isGraded && (
        <Card className="border-emerald-500/30 bg-emerald-500/10 shadow-sm">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                <CheckCircle2 className="h-5 w-5" />
                <span>Capstone Approved: {submission?.score} / {project.max_score} Points</span>
              </div>
              <Badge className="bg-emerald-600 text-white">Certified</Badge>
            </div>
            {submission?.feedback && (
              <div className="p-4 rounded-lg bg-card border border-border/60 text-xs sm:text-sm text-foreground/90 space-y-1">
                <span className="font-semibold block text-foreground">Reviewer Evaluation:</span>
                <p className="leading-relaxed whitespace-pre-wrap">{submission.feedback}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Project Instructions */}
      <Card className="border border-border/80 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Capstone Deliverable Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-xs sm:text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
          {project.instructions ||
            'Prepare a comprehensive executive deliverable. Include your methodology charter, analytical spreadsheets (pay equity, 4/5ths rule), and prioritized remediation roadmap.'}
        </CardContent>
      </Card>

      {/* Rubric */}
      {project.rubric && project.rubric.length > 0 && (
        <Card className="border border-border/80 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">Capstone Rubric</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border">
                  <tr>
                    <th className="p-3">Pillar</th>
                    <th className="p-3">Evaluation Scope</th>
                    <th className="p-3 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {project.rubric.map((r, idx) => (
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

      {/* Submission Portal */}
      <Card className="border border-border/80 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">
            {isGraded ? 'Submitted Deliverables' : submitted ? 'Capstone Under Review' : 'Submit Capstone Deliverables'}
          </CardTitle>
          <CardDescription className="text-xs">
            {submitted
              ? 'Your capstone has been submitted to the academic board.'
              : 'Upload or link your presentation deck, analytics spreadsheets, and executive memo.'}
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
                Executive Memo / Summary Findings (Markdown)
              </Label>
              <Textarea
                id="content"
                rows={10}
                disabled={isGraded}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Executive overview of findings, key metrics, and prioritized 30-60-90 day remediation roadmap..."
                className="text-xs sm:text-sm font-mono leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fileUrl" className="text-xs">
                  Deliverable Presentation Link (Google Slides, PDF, Drive)
                </Label>
                <Input
                  id="fileUrl"
                  type="url"
                  disabled={isGraded}
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="repoUrl" className="text-xs">
                  Supporting Analytics Repository Link (GitHub, Kaggle, etc.)
                </Label>
                <Input
                  id="repoUrl"
                  type="url"
                  disabled={isGraded}
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="text-xs"
                />
              </div>
            </div>

            {!isGraded && (
              <Button type="submit" disabled={submitting} className="gap-2 text-xs">
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> {submitted ? 'Update Capstone' : 'Submit Capstone for Certification'}
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
