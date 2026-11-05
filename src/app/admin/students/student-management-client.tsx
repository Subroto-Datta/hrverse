'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Users,
  Search,
  BookOpen,
  HelpCircle,
  Award,
  Sparkles,
  Clock,
  Filter,
  BrainCircuit,
  Loader2,
} from 'lucide-react'
import type { StudentPerformance } from '@/types'

export function StudentManagementClient({
  initialStudents,
}: {
  initialStudents: StudentPerformance[]
}) {
  const [search, setSearch] = useState('')
  const [progressFilter, setProgressFilter] = useState<'all' | 'completed' | 'active' | 'lagging'>('all')
  const [selectedStudent, setSelectedStudent] = useState<StudentPerformance | null>(null)
  const [studentAIInsight, setStudentAIInsight] = useState<string | null>(null)
  const [loadingAI, setLoadingAI] = useState(false)

  const filtered = initialStudents.filter((item) => {
    const matchesSearch =
      item.student.full_name.toLowerCase().includes(search.toLowerCase()) ||
      item.student.email.toLowerCase().includes(search.toLowerCase())

    if (!matchesSearch) return false

    if (progressFilter === 'completed') return item.enrollment.progress_percentage >= 100
    if (progressFilter === 'active') return item.enrollment.progress_percentage > 25 && item.enrollment.progress_percentage < 100
    if (progressFilter === 'lagging') return item.enrollment.progress_percentage <= 25

    return true
  })

  const handleOpenStudentDetail = async (student: StudentPerformance) => {
    setSelectedStudent(student)
    setStudentAIInsight(null)
  }

  const handleGenerateStudentAIInsight = async () => {
    if (!selectedStudent) return
    setLoadingAI(true)
    try {
      const res = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudent.student.id,
          metrics: {
            fullName: selectedStudent.student.full_name,
            progressPercentage: selectedStudent.enrollment.progress_percentage,
            lessonsCompleted: selectedStudent.lessonsCompleted,
            quizAverage: selectedStudent.quizAverage,
            assessmentAverage: selectedStudent.assessmentAverage,
            timeSpentHours: selectedStudent.timeSpentHours,
          },
        }),
      })

      const data = await res.json()
      if (data.insight) {
        setStudentAIInsight(data.insight)
      }
    } catch (err) {
      console.error('Failed to generate student insight:', err)
    } finally {
      setLoadingAI(false)
    }
  }

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <Users className="h-6 w-6 text-purple-400" /> Student Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Search, filter, inspect profiles, and review AI-generated pedagogical diagnostics.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name or email..."
            className="pl-9 text-xs bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs text-slate-400">Filter Progress:</span>
          {(['all', 'completed', 'active', 'lagging'] as const).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={progressFilter === f ? 'default' : 'outline'}
              onClick={() => setProgressFilter(f)}
              className={`text-xs h-7 capitalize ${
                progressFilter === f
                  ? 'bg-purple-600 text-white'
                  : 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {/* Students Table */}
      <Card className="bg-slate-950 border-slate-800 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Student</th>
                  <th className="p-3.5">Progress</th>
                  <th className="p-3.5">Lessons</th>
                  <th className="p-3.5">Quiz Avg</th>
                  <th className="p-3.5">Assessment Avg</th>
                  <th className="p-3.5">Study Time</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((item) => (
                  <tr key={item.student.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                          {item.student.full_name ? item.student.full_name[0].toUpperCase() : 'S'}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{item.student.full_name || 'Enrolled Student'}</p>
                          <p className="text-[10px] text-slate-500">{item.student.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${item.enrollment.progress_percentage}%` }}
                          />
                        </div>
                        <span className="font-semibold text-white">
                          {item.enrollment.progress_percentage}%
                        </span>
                      </div>
                    </td>

                    <td className="p-3.5 text-slate-300">
                      {item.lessonsCompleted} / {item.totalLessons}
                    </td>

                    <td className="p-3.5">
                      <Badge
                        variant="outline"
                        className={
                          item.quizAverage >= 70
                            ? 'text-emerald-400 border-emerald-500/30'
                            : 'text-rose-400 border-rose-500/30'
                        }
                      >
                        {item.quizAverage}%
                      </Badge>
                    </td>

                    <td className="p-3.5">
                      <Badge variant="outline" className="text-amber-400 border-amber-500/30">
                        {item.assessmentAverage > 0 ? `${item.assessmentAverage} / 100` : 'Pending'}
                      </Badge>
                    </td>

                    <td className="p-3.5 text-slate-400">
                      {item.timeSpentHours} hrs
                    </td>

                    <td className="p-3.5 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenStudentDetail(item)}
                        className="text-xs h-7 border-slate-700 text-slate-300 hover:bg-slate-800"
                      >
                        Inspect Dossier
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Student Profile & AI Insights Modal */}
      {selectedStudent && (
        <Dialog open={Boolean(selectedStudent)} onOpenChange={() => setSelectedStudent(null)}>
          <DialogContent className="max-w-2xl bg-slate-950 border-slate-800 text-white p-6 space-y-4">
            <DialogHeader>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                    {selectedStudent.student.full_name ? selectedStudent.student.full_name[0].toUpperCase() : 'S'}
                  </div>
                  <div>
                    <DialogTitle className="text-lg font-bold text-white">
                      {selectedStudent.student.full_name || 'Enrolled Student'}
                    </DialogTitle>
                    <p className="text-xs text-slate-400">{selectedStudent.student.email}</p>
                  </div>
                </div>
                <Badge className="bg-purple-600 text-white text-xs">
                  {selectedStudent.enrollment.progress_percentage}% Progress
                </Badge>
              </div>
            </DialogHeader>

            {/* Quick Metrics */}
            <div className="grid grid-cols-4 gap-3 text-center bg-slate-900 p-3 rounded-lg border border-slate-800">
              <div>
                <p className="text-[10px] text-slate-400">Lessons Completed</p>
                <p className="text-base font-bold text-white">
                  {selectedStudent.lessonsCompleted} / {selectedStudent.totalLessons}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Quiz Average</p>
                <p className="text-base font-bold text-emerald-400">{selectedStudent.quizAverage}%</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Assessment Avg</p>
                <p className="text-base font-bold text-amber-400">{selectedStudent.assessmentAverage}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Time Logged</p>
                <p className="text-base font-bold text-cyan-400">{selectedStudent.timeSpentHours}h</p>
              </div>
            </div>

            {/* AI Insights Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-400">
                  <Sparkles className="h-4 w-4" />
                  <span>AI Pedagogical Diagnosis (Groq LLM)</span>
                </div>
                <Button
                  size="sm"
                  onClick={handleGenerateStudentAIInsight}
                  disabled={loadingAI}
                  className="text-xs h-7 bg-purple-600 hover:bg-purple-700 text-white gap-1"
                >
                  {loadingAI ? <Loader2 className="h-3 w-3 animate-spin" /> : <BrainCircuit className="h-3 w-3" />}
                  Generate AI Analysis
                </Button>
              </div>

              {studentAIInsight ? (
                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {studentAIInsight}
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-slate-500 text-center">
                  Click &ldquo;Generate AI Analysis&rdquo; to analyze this student&apos;s learning velocity and identify knowledge risks.
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

