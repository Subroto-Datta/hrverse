'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { gradeAssessmentSubmission, gradeProjectSubmission } from '@/actions/admin'
import {
  Inbox,
  CheckCircle2,
  Clock,
  ExternalLink,
  Award,
  Loader2,
  AlertCircle,
} from 'lucide-react'

interface AssessmentSub {
  id: string
  assessment_id: string
  student_id: string
  content: string
  file_urls: string[]
  score: number | null
  feedback: string | null
  status: string
  submitted_at: string | null
  profiles?: { full_name: string; email: string }
  assessments?: { title: string; max_score: number }
}

interface ProjectSub {
  id: string
  project_id: string
  student_id: string
  content: string
  file_urls: string[]
  repository_url: string | null
  score: number | null
  feedback: string | null
  status: string
  submitted_at: string | null
  profiles?: { full_name: string; email: string }
  projects?: { title: string; max_score: number }
}

export function SubmissionsClient({
  assessments,
  projects,
}: {
  assessments: AssessmentSub[]
  projects: ProjectSub[]
}) {
  const [activeTab, setActiveTab] = useState<'assessments' | 'projects'>('assessments')
  const [selectedSub, setSelectedSub] = useState<AssessmentSub | ProjectSub | null>(null)
  const [subType, setSubType] = useState<'assessment' | 'project'>('assessment')
  const [score, setScore] = useState<number>(85)
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const openGradingModal = (sub: AssessmentSub | ProjectSub, type: 'assessment' | 'project') => {
    setSelectedSub(sub)
    setSubType(type)
    setScore(sub.score || 85)
    setFeedback(sub.feedback || '')
    setSuccessMsg('')
  }

  const handleGrade = async () => {
    if (!selectedSub) return
    setSubmitting(true)
    setSuccessMsg('')
    try {
      if (subType === 'assessment') {
        await gradeAssessmentSubmission(selectedSub.id, Number(score), feedback)
      } else {
        await gradeProjectSubmission(selectedSub.id, Number(score), feedback)
      }
      setSuccessMsg('Evaluation recorded successfully!')
      setTimeout(() => setSelectedSub(null), 1500)
    } catch (err: unknown) {
      console.error('Grading error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <Inbox className="h-6 w-6 text-purple-400" /> Assignment & Capstone Evaluation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review written case turnarounds, examine external artifacts, and submit certified feedback.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <Button
            size="sm"
            variant={activeTab === 'assessments' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('assessments')}
            className={`text-xs h-7 ${activeTab === 'assessments' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
          >
            Assessments ({assessments.length})
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'projects' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('projects')}
            className={`text-xs h-7 ${activeTab === 'projects' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
          >
            Capstones ({projects.length})
          </Button>
        </div>
      </div>

      {/* Submissions List */}
      <Card className="bg-slate-950 border-slate-800 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Student</th>
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5">Submitted Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Score</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {activeTab === 'assessments' ? (
                  assessments.length > 0 ? (
                    assessments.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-900/50">
                        <td className="p-3.5 font-semibold text-white">
                          {sub.profiles?.full_name || 'Student'}
                          <p className="text-[10px] text-slate-500 font-normal">{sub.profiles?.email}</p>
                        </td>
                        <td className="p-3.5 text-slate-300">
                          {sub.assessments?.title || 'Assessment'}
                        </td>
                        <td className="p-3.5 text-slate-400">
                          {sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString() : 'Draft'}
                        </td>
                        <td className="p-3.5">
                          <Badge
                            className={
                              sub.status === 'graded'
                                ? 'bg-emerald-600 text-white text-[10px]'
                                : 'bg-amber-600 text-white text-[10px]'
                            }
                          >
                            {sub.status}
                          </Badge>
                        </td>
                        <td className="p-3.5 font-bold text-white">
                          {sub.score !== null ? `${sub.score} / 100` : '-'}
                        </td>
                        <td className="p-3.5 text-right">
                          <Button
                            size="sm"
                            onClick={() => openGradingModal(sub, 'assessment')}
                            className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            Evaluate
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No assessment submissions found in queue.
                      </td>
                    </tr>
                  )
                ) : projects.length > 0 ? (
                  projects.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-900/50">
                      <td className="p-3.5 font-semibold text-white">
                        {sub.profiles?.full_name || 'Student'}
                        <p className="text-[10px] text-slate-500 font-normal">{sub.profiles?.email}</p>
                      </td>
                      <td className="p-3.5 text-slate-300">
                        {sub.projects?.title || 'Capstone Project'}
                      </td>
                      <td className="p-3.5 text-slate-400">
                        {sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString() : 'Draft'}
                      </td>
                      <td className="p-3.5">
                        <Badge
                          className={
                            sub.status === 'graded'
                              ? 'bg-emerald-600 text-white text-[10px]'
                              : 'bg-amber-600 text-white text-[10px]'
                          }
                        >
                          {sub.status}
                        </Badge>
                      </td>
                      <td className="p-3.5 font-bold text-white">
                        {sub.score !== null ? `${sub.score} / 100` : '-'}
                      </td>
                      <td className="p-3.5 text-right">
                        <Button
                          size="sm"
                          onClick={() => openGradingModal(sub, 'project')}
                          className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          Evaluate
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No capstone submissions found in queue.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Evaluation Modal */}
      {selectedSub && (
        <Dialog open={Boolean(selectedSub)} onOpenChange={() => setSelectedSub(null)}>
          <DialogContent className="max-w-3xl bg-slate-950 border-slate-800 text-white p-6 space-y-4">
            <DialogHeader>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <DialogTitle className="text-lg font-bold text-white">
                    Evaluate Submission: {selectedSub.profiles?.full_name}
                  </DialogTitle>
                  <p className="text-xs text-slate-400">
                    {subType === 'assessment'
                      ? (selectedSub as AssessmentSub).assessments?.title
                      : (selectedSub as ProjectSub).projects?.title}
                  </p>
                </div>
                <Badge className="bg-purple-600 text-white text-xs">
                  Max: 100 Points
                </Badge>
              </div>
            </DialogHeader>

            {/* Student Deliverable Content */}
            <div className="space-y-2">
              <Label className="text-xs text-slate-300">Submitted Deliverable Text</Label>
              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                {selectedSub.content || 'No text content provided.'}
              </div>
            </div>

            {/* External Links */}
            {selectedSub.file_urls && selectedSub.file_urls.length > 0 && (
              <div className="space-y-1">
                <Label className="text-xs text-slate-300">Deliverable Document Link</Label>
                <div className="flex items-center gap-2">
                  <a
                    href={selectedSub.file_urls[0]}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-purple-400 hover:underline flex items-center gap-1.5"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> {selectedSub.file_urls[0]}
                  </a>
                </div>
              </div>
            )}

            {/* Grading Form */}
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300">Numeric Score (0-100)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    className="text-xs bg-slate-900 border-slate-700 text-white font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Evaluator Qualitative Feedback</Label>
                <Textarea
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide constructive assessment against rubric criteria..."
                  className="text-xs bg-slate-900 border-slate-700 text-slate-200"
                />
              </div>

              {successMsg && (
                <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedSub(null)}
                  className="text-xs border-slate-700 text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleGrade}
                  disabled={submitting}
                  className="text-xs bg-purple-600 hover:bg-purple-700 text-white gap-1.5"
                >
                  {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Award className="h-3.5 w-3.5" />}
                  Record Evaluation & Return
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

