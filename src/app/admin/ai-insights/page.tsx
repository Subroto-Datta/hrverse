import { getAdminDashboardMetrics } from '@/lib/analytics/data'
import { AIInsightsClient } from './ai-insights-client'
import { Sparkles } from 'lucide-react'

export default async function AdminAIInsightsPage() {
  const metrics = await getAdminDashboardMetrics()

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-slate-800 pb-6 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <Sparkles className="h-6 w-6 text-amber-400" /> AI Insights & Executive Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Synthesize learner challenges, curriculum friction points, and automated pedagogical recommendations.
        </p>
      </div>

      <AIInsightsClient
        totalStudents={metrics.totalStudents}
        activeStudents={metrics.activeStudents}
        completionRate={metrics.courseCompletionRate}
        quizPassRate={metrics.quizPassRate}
      />
    </div>
  )
}

