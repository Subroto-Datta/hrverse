import { getAdminDashboardMetrics } from '@/lib/analytics/data'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, TrendingUp, Users, Award, HelpCircle } from 'lucide-react'

export default async function AdminAnalyticsPage() {
  const metrics = await getAdminDashboardMetrics()

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <BarChart3 className="h-6 w-6 text-purple-400" /> Student Performance Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Cohort intelligence, score distributions, pass rates, and completion trajectories.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-950 border-slate-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-300">Cohort Completion Rate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-extrabold text-white">{metrics.courseCompletionRate}%</p>
            <p className="text-xs text-slate-400">
              {metrics.totalStudents} total enrolled students across modules.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-950 border-slate-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-300">Mean Assessment Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-extrabold text-emerald-400">{metrics.averageAssessmentScore} / 100</p>
            <p className="text-xs text-slate-400">
              Across case turnaround scenarios and strategic roadmaps.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-950 border-slate-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-300">Quiz Pass Velocity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-extrabold text-purple-400">{metrics.quizPassRate}%</p>
            <p className="text-xs text-slate-400">
              Students scoring &ge; 70% threshold on first or second attempt.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-950 border-slate-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold text-white">Curriculum Competency Health</CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Pass rates by subject domain benchmarked against international standards.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Strategic HRM & Job Analysis (Module 1 & 2)</span>
              <span className="font-bold text-emerald-400">88% Mastery</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88%' }} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Predictive Talent Acquisition & STAR Interviews (Module 3)</span>
              <span className="font-bold text-purple-400">82% Mastery</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '82%' }} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Compensation Engineering & Compa-Ratios (Module 4)</span>
              <span className="font-bold text-amber-400">74% Mastery</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '74%' }} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Performance Systems, OKRs & ADDIE (Module 5 & 6)</span>
              <span className="font-bold text-cyan-400">79% Mastery</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full" style={{ width: '79%' }} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

