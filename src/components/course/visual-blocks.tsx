'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Calculator,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  FileText,
  Building2,
  Users,
  Award,
  AlertCircle,
  Quote,
  CheckSquare,
  Square,
  Clock,
  Layers,
  ChevronRight,
} from 'lucide-react'

// ============================================================
// 1. INTERACTIVE FORMULA & METRIC CALCULATOR WIDGET
// ============================================================
export function InteractiveCalculator({
  type,
  title,
  description,
  defaultValues = {},
}: {
  type: 'attrition_rate' | 'workforce_gap' | 'cost_per_hire' | 'offer_acceptance'
  title: string
  description?: string
  defaultValues?: Record<string, number>
}) {
  // Attrition Rate State
  const [opening, setOpening] = useState(defaultValues.opening ?? 150)
  const [closing, setClosing] = useState(defaultValues.closing ?? 130)
  const [leavers, setLeavers] = useState(defaultValues.leavers ?? 25)

  // Workforce Gap State
  const [demand, setDemand] = useState(defaultValues.demand ?? 60)
  const [supply, setSupply] = useState(defaultValues.supply ?? 52)

  // Cost Per Hire State
  const [cost, setCost] = useState(defaultValues.cost ?? 120000)
  const [hires, setHires] = useState(defaultValues.hires ?? 8)

  // Offer Acceptance State
  const [offersExtended, setOffersExtended] = useState(defaultValues.offersExtended ?? 50)
  const [offersAccepted, setOffersAccepted] = useState(defaultValues.offersAccepted ?? 35)

  return (
    <Card className="my-8 border border-amber-500/25 bg-gradient-to-br from-card via-card to-amber-500/[0.03] shadow-md dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_8px_30px_-6px_rgba(0,0,0,0.5)] overflow-hidden">
      <CardHeader className="bg-amber-500/[0.06] border-b border-amber-500/20 pb-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                {title}
              </CardTitle>
              {description && (
                <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
              )}
            </div>
          </div>
          <Badge variant="outline" className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 border-amber-500/30 bg-amber-500/10">
            Interactive Tool
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Attrition Rate Calculator */}
        {type === 'attrition_rate' && (() => {
          const avgHeadcount = (opening + closing) / 2
          const attritionRate = avgHeadcount > 0 ? ((leavers / avgHeadcount) * 100).toFixed(2) : '0'
          const numRate = parseFloat(attritionRate)

          let statusColor = 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10'
          let statusText = 'Healthy Attrition (<12%)'
          if (numRate > 20) {
            statusColor = 'text-rose-500 border-rose-500/30 bg-rose-500/10'
            statusText = 'Critical High Turnover (>20%) — High Replacement Cost Risk'
          } else if (numRate >= 12) {
            statusColor = 'text-amber-500 border-amber-500/30 bg-amber-500/10'
            statusText = 'Moderate Turnover (12%–20%) — Monitor Retention Initiatives'
          }

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground flex justify-between">
                    <span>Opening Headcount</span>
                    <span className="font-bold text-foreground">{opening}</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="5"
                    value={opening}
                    onChange={(e) => setOpening(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground flex justify-between">
                    <span>Closing Headcount</span>
                    <span className="font-bold text-foreground">{closing}</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="5"
                    value={closing}
                    onChange={(e) => setClosing(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground flex justify-between">
                    <span>Employees Who Left (Leavers)</span>
                    <span className="font-bold text-foreground">{leavers}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={leavers}
                    onChange={(e) => setLeavers(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-border/80 bg-muted/40 p-5 space-y-4">
                <div className="text-xs text-muted-foreground font-mono">
                  Average Headcount = ({opening} + {closing}) ÷ 2 ={' '}
                  <strong className="text-foreground">{avgHeadcount}</strong>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Calculated Attrition Rate
                  </span>
                  <div className="text-4xl font-extrabold text-foreground tracking-tight">
                    {attritionRate}%
                  </div>
                </div>
                <div className={`p-2.5 rounded-lg border text-xs font-medium ${statusColor}`}>
                  {statusText}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Formula: <code className="px-1 py-0.5 rounded bg-muted font-mono font-bold">(Number of Leavers ÷ Average Headcount) × 100</code>
                </p>
              </div>
            </div>
          )
        })()}

        {/* Workforce Gap Calculator */}
        {type === 'workforce_gap' && (() => {
          const gap = demand - supply
          const isShortage = gap > 0
          const isSurplus = gap < 0

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground flex justify-between">
                    <span>Workforce Demand (Employees Needed)</span>
                    <span className="font-bold text-foreground">{demand}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="200"
                    value={demand}
                    onChange={(e) => setDemand(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground flex justify-between">
                    <span>Workforce Supply (Available Employees)</span>
                    <span className="font-bold text-foreground">{supply}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="200"
                    value={supply}
                    onChange={(e) => setSupply(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-border/80 bg-muted/40 p-5 space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Workforce Gap Result
                  </span>
                  <div className="text-4xl font-extrabold text-foreground tracking-tight">
                    {Math.abs(gap)} {Math.abs(gap) === 1 ? 'Role' : 'Roles'}
                  </div>
                </div>

                {isShortage && (
                  <div className="p-2.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>Deficit (Shortage): HR must urgently initiate recruitment or overtime.</span>
                  </div>
                )}
                {isSurplus && (
                  <div className="p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 shrink-0" />
                    <span>Surplus: Redeploy staff, offer voluntary sabbaticals, or pause hiring.</span>
                  </div>
                )}
                {gap === 0 && (
                  <div className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Balanced: Staffing perfectly matches operational workload requirements.</span>
                  </div>
                )}

                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Formula: <code className="px-1 py-0.5 rounded bg-muted font-mono font-bold">Workforce Demand - Workforce Supply</code>
                </p>
              </div>
            </div>
          )
        })()}

        {/* Cost Per Hire Calculator */}
        {type === 'cost_per_hire' && (() => {
          const costPerHire = hires > 0 ? Math.round(cost / hires) : 0

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground flex justify-between">
                    <span>Total Recruitment Cost (₹)</span>
                    <span className="font-bold text-foreground">₹{cost.toLocaleString()}</span>
                  </label>
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground flex justify-between">
                    <span>Number of Successful Hires</span>
                    <span className="font-bold text-foreground">{hires}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={hires}
                    onChange={(e) => setHires(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-border/80 bg-muted/40 p-5 space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Cost Per Hire (CPH)
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                    ₹{costPerHire.toLocaleString()}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Includes agency fees, job board postings, interviewer hours, credential verification, and onboarding kits.
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Formula: <code className="px-1 py-0.5 rounded bg-muted font-mono font-bold">Total Recruitment Costs ÷ Number of Hires</code>
                </p>
              </div>
            </div>
          )
        })()}

        {/* Offer Acceptance Rate Calculator */}
        {type === 'offer_acceptance' && (() => {
          const rate = offersExtended > 0 ? Math.round((offersAccepted / offersExtended) * 100) : 0
          let statusText = 'Excellent Acceptance (>85%) — Competitive salary & brand'
          let statusColor = 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10'

          if (rate < 70) {
            statusText = 'Alarming Drop-Off (<70%) — Salary or hiring delay issue'
            statusColor = 'text-rose-500 border-rose-500/30 bg-rose-500/10'
          } else if (rate < 85) {
            statusText = 'Moderate Acceptance (70%–85%) — Review competing employer offers'
            statusColor = 'text-amber-500 border-amber-500/30 bg-amber-500/10'
          }

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground flex justify-between">
                    <span>Job Offers Extended</span>
                    <span className="font-bold text-foreground">{offersExtended}</span>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={offersExtended}
                    onChange={(e) => {
                      const v = Number(e.target.value)
                      setOffersExtended(v)
                      if (offersAccepted > v) setOffersAccepted(v)
                    }}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground flex justify-between">
                    <span>Offers Accepted by Candidates</span>
                    <span className="font-bold text-foreground">{offersAccepted}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={offersExtended}
                    value={offersAccepted}
                    onChange={(e) => setOffersAccepted(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-border/80 bg-muted/40 p-5 space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Offer Acceptance Rate
                  </span>
                  <div className="text-4xl font-extrabold text-foreground tracking-tight">
                    {rate}%
                  </div>
                </div>
                <div className={`p-2.5 rounded-lg border text-xs font-medium ${statusColor}`}>
                  {statusText}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Formula: <code className="px-1 py-0.5 rounded bg-muted font-mono font-bold">(Offers Accepted ÷ Offers Extended) × 100</code>
                </p>
              </div>
            </div>
          )
        })()}
      </CardContent>
    </Card>
  )
}

// ============================================================
// 2. INTERACTIVE PROCESS PIPELINE & LIFECYCLE WORKFLOW
// ============================================================
export function ProcessSteps({
  title,
  subtitle,
  steps,
}: {
  title?: string
  subtitle?: string
  steps: Array<{
    step: number | string
    title: string
    subtitle?: string
    description: string
    keyAction?: string
    badge?: string
  }>
}) {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <div className="my-8 space-y-4">
      {title && (
        <div className="space-y-1">
          <h3 className="text-lg sm:text-xl font-extrabold text-foreground flex items-center gap-2">
            <Layers className="h-5 w-5 text-amber-500" />
            <span>{title}</span>
          </h3>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      )}

      {/* Stepper Navigation Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {steps.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setActiveStep(idx)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              activeStep === idx
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/40 shadow-xs'
                : 'bg-card text-muted-foreground border-border/60 hover:border-amber-500/25 hover:text-foreground'
            }`}
          >
            <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              activeStep === idx
                ? 'bg-amber-500 text-black'
                : 'bg-muted text-muted-foreground'
            }`}>
              {s.step}
            </span>
            <span>{s.title}</span>
          </button>
        ))}
      </div>

      {/* Active Step Showcase Card */}
      {steps[activeStep] && (
        <Card className="border border-border/80 bg-gradient-to-br from-card via-card to-amber-500/[0.02] shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 font-extrabold text-sm border border-amber-500/30">
                  {steps[activeStep].step}
                </span>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-foreground">
                    {steps[activeStep].title}
                  </h4>
                  {steps[activeStep].subtitle && (
                    <p className="text-xs text-muted-foreground">{steps[activeStep].subtitle}</p>
                  )}
                </div>
              </div>
              {steps[activeStep].badge && (
                <Badge variant="outline" className="text-xs font-semibold text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10">
                  {steps[activeStep].badge}
                </Badge>
              )}
            </div>

            <p className="text-sm leading-relaxed text-foreground/90">
              {steps[activeStep].description}
            </p>

            {steps[activeStep].keyAction && (
              <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/[0.05] text-xs space-y-1">
                <span className="font-bold text-amber-700 dark:text-amber-300 block">
                  Critical HR Action Required:
                </span>
                <p className="text-foreground/80 leading-relaxed">
                  {steps[activeStep].keyAction}
                </p>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <button
                disabled={activeStep === 0}
                onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                ← Previous Stage
              </button>
              <span className="text-xs font-mono text-muted-foreground">
                {activeStep + 1} of {steps.length}
              </span>
              <button
                disabled={activeStep === steps.length - 1}
                onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                Next Stage →
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ============================================================
// 3. COMPARISON MATRIX (SIDE-BY-SIDE CARDS)
// ============================================================
export function ComparisonMatrix({
  title,
  subtitle,
  items,
}: {
  title?: string
  subtitle?: string
  items: Array<{
    title: string
    badge?: string
    focus: string
    mindset: string
    keyDifferences: string[]
    hospitalExample?: string
  }>
}) {
  return (
    <div className="my-8 space-y-4">
      {title && (
        <div className="space-y-1">
          <h3 className="text-lg sm:text-xl font-extrabold text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      )}

      <div className={`grid grid-cols-1 md:grid-cols-${Math.min(items.length, 3)} gap-4`}>
        {items.map((item, idx) => (
          <Card
            key={idx}
            className="border border-border/80 bg-card hover:border-amber-500/35 hover:shadow-md transition-all duration-200"
          >
            <CardHeader className="bg-muted/30 border-b border-border/60 pb-3.5">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base font-bold text-foreground">
                  {item.title}
                </CardTitle>
                {item.badge && (
                  <Badge variant="outline" className="text-[10px] font-bold text-amber-700 dark:text-amber-300 border-amber-500/25 bg-amber-500/10">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-medium mt-1">
                Primary Focus: <span className="text-foreground">{item.focus}</span>
              </p>
            </CardHeader>

            <CardContent className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <span className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider block">
                  Core Philosophy
                </span>
                <p className="text-foreground/90 font-medium leading-relaxed">
                  {item.mindset}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-border/50">
                <span className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider block">
                  Key Characteristics
                </span>
                <ul className="space-y-1 pl-1">
                  {item.keyDifferences.map((diff, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-2 text-foreground/85">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span>{diff}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {item.hospitalExample && (
                <div className="pt-2 border-t border-border/50">
                  <span className="font-bold text-amber-700 dark:text-amber-300 block mb-1 text-[11px]">
                    Hospital Context:
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.hospitalExample}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// 4. INTERACTIVE CASE SIMULATOR & KNOWLEDGE CHECKPOINT
// ============================================================
export function InteractiveCheckpoint({
  question,
  scenario,
  options,
  correctOptionIndex,
  explanation,
  mentorTip,
}: {
  question: string
  scenario?: string
  options: string[]
  correctOptionIndex: number
  explanation: string
  mentorTip?: string
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  const handleSelect = (idx: number) => {
    setSelected(idx)
    setRevealed(true)
  }

  const isCorrect = selected === correctOptionIndex

  return (
    <Card className="my-8 border border-amber-500/25 bg-gradient-to-br from-card via-card to-amber-500/[0.02] shadow-sm overflow-hidden">
      <CardHeader className="bg-amber-500/[0.07] border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>Practical Knowledge Checkpoint</span>
        </div>
        <CardTitle className="text-base sm:text-lg font-bold text-foreground mt-1">
          {question}
        </CardTitle>
        {scenario && (
          <p className="text-xs text-muted-foreground leading-relaxed mt-1">
            {scenario}
          </p>
        )}
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          {options.map((opt, idx) => {
            let itemStyle = 'border-border/70 hover:border-amber-500/35 hover:bg-muted/40 text-foreground'
            if (revealed) {
              if (idx === correctOptionIndex) {
                itemStyle = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 font-semibold'
              } else if (selected === idx) {
                itemStyle = 'border-rose-500/50 bg-rose-500/10 text-rose-800 dark:text-rose-200'
              } else {
                itemStyle = 'opacity-40 border-border/40 text-muted-foreground'
              }
            }

            return (
              <button
                key={idx}
                disabled={revealed}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${itemStyle}`}
              >
                <span>{opt}</span>
                {revealed && idx === correctOptionIndex && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                )}
                {revealed && selected === idx && idx !== correctOptionIndex && (
                  <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
                )}
              </button>
            )
          })}
        </div>

        {revealed && (
          <div className="pt-3 border-t border-border/60 space-y-3 animate-in fade-in duration-200">
            <div className={`p-4 rounded-xl text-xs sm:text-sm border ${
              isCorrect
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200'
            }`}>
              <div className="font-bold flex items-center gap-1.5 mb-1">
                {isCorrect ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <AlertCircle className="h-4 w-4 text-rose-500" />}
                <span>{isCorrect ? 'Correct Decision!' : 'Not Quite — Here is Why:'}</span>
              </div>
              <p className="leading-relaxed">{explanation}</p>
            </div>

            {mentorTip && (
              <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] text-xs space-y-1">
                <span className="font-bold text-amber-700 dark:text-amber-300 block">
                  Mentor Coaching Insight:
                </span>
                <p className="text-foreground/80 leading-relaxed">{mentorTip}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ============================================================
// 5. INTERACTIVE SELF-MASTERY CHECKLIST
// ============================================================
export function InteractiveChecklist({
  title,
  subtitle,
  items,
}: {
  title: string
  subtitle?: string
  items: string[]
}) {
  const [checkedState, setCheckedState] = useState<Record<number, boolean>>({})

  const toggleCheck = (idx: number) => {
    setCheckedState((prev) => ({ ...prev, [idx]: !prev[idx] }))
  }

  const completedCount = Object.values(checkedState).filter(Boolean).length
  const progressPct = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0

  return (
    <Card className="my-8 border border-border/80 bg-card shadow-xs">
      <CardHeader className="bg-muted/30 border-b border-border/60 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-amber-500" />
              <span>{title}</span>
            </CardTitle>
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-28 bg-muted rounded-full h-2 overflow-hidden border border-border">
              <div
                className="bg-amber-500 h-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-xs font-bold text-foreground font-mono">
              {completedCount}/{items.length}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-2">
        {items.map((item, idx) => {
          const isDone = !!checkedState[idx]
          return (
            <button
              key={idx}
              onClick={() => toggleCheck(idx)}
              className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${
                isDone
                  ? 'border-emerald-500/30 bg-emerald-500/[0.04] text-foreground'
                  : 'border-border/60 hover:border-amber-500/30 hover:bg-muted/30 text-foreground/80'
              }`}
            >
              <div className="mt-0.5">
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                ) : (
                  <Square className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
              </div>
              <span className={isDone ? 'line-through text-muted-foreground' : ''}>
                {item}
              </span>
            </button>
          )
        })}

        {progressPct === 100 && (
          <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold text-center mt-3">
            🎉 Outstanding! You have satisfied all learning outcomes for today.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ============================================================
// 6. HOSPITAL DEPARTMENT & WORKFORCE HIERARCHY MAP
// ============================================================
export function DepartmentMap({
  title,
  departments,
}: {
  title: string
  departments: Array<{
    name: string
    roles: string
    headcount?: number
    focus: string
    compliance?: string
  }>
}) {
  return (
    <div className="my-8 space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg sm:text-xl font-extrabold text-foreground flex items-center gap-2">
          <Building2 className="h-5 w-5 text-amber-500" />
          <span>{title}</span>
        </h3>
        <p className="text-xs text-muted-foreground">
          Hospital departmental workforce distribution and staffing alignment.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {departments.map((dept, idx) => (
          <Card
            key={idx}
            className="border border-border/80 bg-card hover:border-amber-500/30 transition-all duration-200"
          >
            <CardContent className="p-4 space-y-2.5">
              <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2">
                <span className="font-bold text-sm text-foreground">{dept.name}</span>
                {dept.headcount !== undefined && (
                  <Badge variant="outline" className="text-[10px] font-mono text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10">
                    {dept.headcount} Staff
                  </Badge>
                )}
              </div>

              <div className="text-xs space-y-1">
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">Roles:</span> {dept.roles}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">Focus:</span> {dept.focus}
                </p>
                {dept.compliance && (
                  <p className="text-[11px] text-amber-700 dark:text-amber-300 font-medium pt-1">
                    Req: {dept.compliance}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// 7. PRACTICAL ASSIGNMENT & DELIVERABLE BRIEF CARD
// ============================================================
export function AssignmentCard({
  title,
  durationMinutes,
  objective,
  tasks,
  submissionFormat,
}: {
  title: string
  durationMinutes?: number
  objective: string
  tasks: string[]
  submissionFormat?: string
}) {
  return (
    <Card className="my-8 border border-amber-500/30 bg-gradient-to-br from-card via-card to-amber-500/[0.04] shadow-sm">
      <CardHeader className="bg-amber-500/[0.08] border-b border-amber-500/20 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-base sm:text-lg font-bold text-foreground">
              {title}
            </CardTitle>
          </div>
          {durationMinutes && (
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-amber-500" /> Est. {durationMinutes} mins
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-1">
          <strong>Objective:</strong> {objective}
        </p>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Required Tasks & Deliverables:
          </h4>
          <ol className="space-y-2 pl-4 list-decimal text-xs sm:text-sm text-foreground/90">
            {tasks.map((task, idx) => (
              <li key={idx} className="leading-relaxed">
                {task}
              </li>
            ))}
          </ol>
        </div>

        {submissionFormat && (
          <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
            <span><strong>Format:</strong> {submissionFormat}</span>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">Review with Mentor</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ============================================================
// 8. EXECUTIVE TAKEAWAY & GOLDEN PRINCIPLE BANNER
// ============================================================
export function TakeawayBanner({
  quote,
  author,
  tag = 'Key HR Takeaway',
}: {
  quote: string
  author?: string
  tag?: string
}) {
  return (
    <div className="my-8 relative rounded-2xl border border-amber-500/25 bg-amber-500/[0.04] dark:bg-amber-500/[0.03] p-6 shadow-xs overflow-hidden">
      <Quote className="absolute -bottom-4 -right-4 h-24 w-24 text-amber-500/10 -rotate-12 pointer-events-none" />
      <div className="space-y-2 relative">
        <Badge variant="outline" className="text-[10px] font-bold text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10 uppercase">
          {tag}
        </Badge>
        <p className="text-sm sm:text-base font-medium italic text-foreground/95 leading-relaxed">
          &ldquo;{quote}&rdquo;
        </p>
        {author && (
          <p className="text-xs text-muted-foreground font-semibold pt-1">
            — {author}
          </p>
        )}
      </div>
    </div>
  )
}

// ============================================================
// 9. STATS & BENCHMARK HIGHLIGHT GRID
// ============================================================
export function StatsGrid({
  stats,
}: {
  stats: Array<{
    value: string
    label: string
    subtext?: string
    badge?: string
  }>
}) {
  return (
    <div className="my-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat, idx) => (
        <Card key={idx} className="border border-border/80 bg-card p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {stat.value}
            </span>
            {stat.badge && (
              <Badge variant="outline" className="text-[9px] font-bold text-amber-600 dark:text-amber-400 border-amber-500/20 bg-amber-500/10">
                {stat.badge}
              </Badge>
            )}
          </div>
          <p className="text-xs font-semibold text-foreground/80">{stat.label}</p>
          {stat.subtext && <p className="text-[10px] text-muted-foreground">{stat.subtext}</p>}
        </Card>
      ))}
    </div>
  )
}
