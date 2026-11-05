'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Users,
  Activity,
  CheckCircle2,
  Award,
  HelpCircle,
  AlertTriangle,
  TrendingUp,
  UserPlus,
  Inbox,
  ArrowRight,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import Link from 'next/link'
import type { DashboardMetrics } from '@/types'

export function AdminDashboardClient({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Executive Admin Dashboard
            </h1>
            <Badge className="bg-purple-600 text-white text-[10px]">Live Database</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time telemetry, student progression, quiz pass rates, and evaluation queues.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/lessons">
            <Button size="sm" variant="outline" className="text-xs border-slate-700 text-slate-200 hover:bg-slate-800">
              Content Editor
            </Button>
          </Link>
          <Link href="/admin/submissions">
            <Button size="sm" className="text-xs bg-purple-600 hover:bg-purple-700 text-white gap-1.5 shadow-sm">
              <Inbox className="h-4 w-4" /> Grading Queue
            </Button>
          </Link>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="bg-slate-950 border-slate-800 shadow-sm">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400">Total Students</span>
              <Users className="h-4 w-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white">{metrics.totalStudents}</p>
            <p className="text-[10px] text-slate-500">Registered learners</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-950 border-slate-800 shadow-sm">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400">Active Students</span>
              <Activity className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white">{metrics.activeStudents}</p>
            <p className="text-[10px] text-emerald-400">Last 14 days active</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-950 border-slate-800 shadow-sm">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400">Completion Rate</span>
              <CheckCircle2 className="h-4 w-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-bold text-white">{metrics.courseCompletionRate}%</p>
            <p className="text-[10px] text-slate-500">Curriculum graduation</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-950 border-slate-800 shadow-sm">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400">Avg Assessment</span>
              <Award className="h-4 w-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-white">{metrics.averageAssessmentScore}</p>
            <p className="text-[10px] text-slate-500">Out of 100 max pts</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-950 border-slate-800 shadow-sm">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400">Quiz Pass Rate</span>
              <HelpCircle className="h-4 w-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-bold text-white">{metrics.quizPassRate}%</p>
            <p className="text-[10px] text-slate-500">70% passing threshold</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-950 border-slate-800 shadow-sm">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400">Falling Behind</span>
              <AlertTriangle className="h-4 w-4 text-rose-400" />
            </div>
            <p className="text-2xl font-bold text-white">{metrics.studentsFallingBehind}</p>
            <p className="text-[10px] text-rose-400">Requires intervention</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Trends Chart */}
      <Card className="bg-slate-950 border-slate-800 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-400" /> Weekly Learning Activity Trends
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Lessons completed, quizzes attempted, and written assessments submitted
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-slate-400 border-slate-700 text-[10px]">
              Last 7 Days
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="h-72 pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.activityTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="lessons_completed" name="Lessons Completed" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="quizzes_taken" name="Quizzes Taken" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="assessments_submitted" name="Assessments Submitted" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Two Column Section: Recent Registrations & Pending Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Registrations */}
        <Card className="bg-slate-950 border-slate-800 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-800/80">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-purple-400" /> Recent Student Registrations
              </CardTitle>
              <Link href="/admin/students" className="text-[11px] text-purple-400 hover:underline">
                View All
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {metrics.recentRegistrations && metrics.recentRegistrations.length > 0 ? (
              metrics.recentRegistrations.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                      {student.full_name ? student.full_name[0].toUpperCase() : 'S'}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{student.full_name || 'Enrolled Student'}</p>
                      <p className="text-[10px] text-slate-400">{student.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {new Date(student.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">No recent registrations.</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Submissions */}
        <Card className="bg-slate-950 border-slate-800 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-800/80">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <Inbox className="h-4 w-4 text-indigo-400" /> Recent Assessment Submissions
              </CardTitle>
              <Link href="/admin/submissions" className="text-[11px] text-purple-400 hover:underline">
                Grading Queue
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {metrics.recentSubmissions && metrics.recentSubmissions.length > 0 ? (
              metrics.recentSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs"
                >
                  <div>
                    <p className="font-semibold text-white">Submission #{sub.id.slice(0, 8)}</p>
                    <p className="text-[10px] text-slate-400 capitalize">Status: {sub.status}</p>
                  </div>
                  <Link href={`/admin/submissions`}>
                    <Button size="sm" variant="outline" className="h-7 text-[11px] border-slate-700 text-slate-300">
                      Evaluate
                    </Button>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">No submissions awaiting grading.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
