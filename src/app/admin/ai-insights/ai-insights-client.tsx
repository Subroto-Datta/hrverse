'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, BrainCircuit, Users, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'

export function AIInsightsClient({
  totalStudents,
  activeStudents,
  completionRate,
  quizPassRate,
}: {
  totalStudents: number
  activeStudents: number
  completionRate: number
  quizPassRate: number
}) {
  const [insight, setInsight] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleScanCohort = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metrics: {
            cohortOverview: 'CHRMP 8-Week Executive Certification',
            totalStudents,
            activeStudents,
            completionRate,
            quizPassRate,
            topDifficultyModule: 'Module 4: Compensation Architecture & Total Rewards (compa-ratios & range spread formulas)',
          },
        }),
      })

      const data = await res.json()
      if (data.insight) {
        setInsight(data.insight)
      }
    } catch (err) {
      console.error('Cohort AI Scan error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-950 border-amber-500/30 shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" /> Cohort Intelligence & Predictive Risk Engine
              </h2>
              <p className="text-xs text-slate-400">
                Powered by Groq LLM. Dissects cohort telemetry, identifies curriculum bottlenecks, and generates actionable administrative interventions.
              </p>
            </div>

            <Button
              size="sm"
              onClick={handleScanCohort}
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 text-white gap-2 text-xs shrink-0 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Scanning Cohort...
                </>
              ) : (
                <>
                  <BrainCircuit className="h-4 w-4" /> Run Comprehensive Cohort Scan
                </>
              )}
            </Button>
          </div>

          {insight ? (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
              {insight}
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 text-center">
              Click &ldquo;Run Comprehensive Cohort Scan&rdquo; to execute multi-variate Groq AI analysis on cohort telemetry.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

