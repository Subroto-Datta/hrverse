'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { Sparkles, BrainCircuit, CheckCircle2, TrendingUp, Loader2 } from 'lucide-react'

export function StudentAnalyticsClient({
  attempts,
  completedCount,
  totalLessons,
}: {
  attempts: Array<{
    id: string
    quiz_id: string
    percentage: number
    score: number
    total_points: number
    passed: boolean
    completed_at: string
  }>
  completedCount: number
  totalLessons: number
}) {
  const [aiInsight, setAiInsight] = useState<string | null>(null)
  const [loadingAI, setLoadingAI] = useState(false)

  // Format chart data for quiz scores
  const scoreData =
    attempts.length > 0
      ? attempts.slice(0, 10).reverse().map((a, idx) => ({
          name: `Attempt ${idx + 1}`,
          percentage: Number(a.percentage),
          passThreshold: 70,
        }))
      : [
          { name: 'Baseline', percentage: 70, passThreshold: 70 },
          { name: 'Target', percentage: 90, passThreshold: 70 },
        ]

  // Module completion comparison
  const completionData = [
    { name: 'Completed', count: completedCount, fill: '#6366f1' },
    { name: 'Remaining', count: Math.max(0, totalLessons - completedCount), fill: '#e2e8f0' },
  ]

  const handleGenerateAIInsights = async () => {
    setLoadingAI(true)
    try {
      const res = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metrics: {
            completedLessons: completedCount,
            totalLessons,
            quizAttemptsCount: attempts.length,
            quizScores: attempts.map((a) => a.percentage),
          },
        }),
      })

      const data = await res.json()
      if (data.insight) {
        setAiInsight(data.insight)
      }
    } catch (err) {
      console.error('Failed to load AI insights:', err)
    } finally {
      setLoadingAI(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* AI Performance Insight Generator Banner */}
      <Card className="border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-card shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-base">
                <Sparkles className="h-5 w-5" />
                <span>AI Learning Diagnostic & Personalized Recommendations</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Groq AI analyzes your quiz score distributions and pace to identify high-priority knowledge gaps.
              </p>
            </div>
            <Button
              size="sm"
              onClick={handleGenerateAIInsights}
              disabled={loadingAI}
              className="gap-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
            >
              {loadingAI ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Synthesizing...
                </>
              ) : (
                <>
                  <BrainCircuit className="h-3.5 w-3.5" /> Generate AI Diagnosis
                </>
              )}
            </Button>
          </div>

          {aiInsight && (
            <div className="p-4 rounded-xl bg-card border border-border/80 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
              {aiInsight}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recharts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quiz Performance Over Time */}
        <Card className="border border-border/80 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Quiz Score Trajectory
            </CardTitle>
            <CardDescription className="text-xs">
              Historical percentages plotted against the 70% passing threshold
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="percentage"
                  name="Your Score (%)"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="passThreshold"
                  name="Pass Line (70%)"
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lesson Progress Ratio */}
        <Card className="border border-border/80 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Curriculum Completion Ratio
            </CardTitle>
            <CardDescription className="text-xs">
              Completed lessons vs. pending lessons in the program
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" name="Lessons" fill="#8884d8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
