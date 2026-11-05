import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  GraduationCap,
  ArrowRight,
  Sparkles,
  Users,
  Target,
  BarChart3,
  Award,
  CheckCircle2,
  BookOpen,
} from 'lucide-react'
import { MotionDiv, MotionH1, MotionP, fadeIn, staggerContainer } from '@/components/layout/motion-wrapper'

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MotionDiv
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto space-y-6"
          >
            <MotionDiv
              variants={fadeIn}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Next-Generation AI-Powered HR Learning</span>
            </MotionDiv>

            <MotionH1
              variants={fadeIn}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]"
            >
              Master Strategic Human Resources with{' '}
              <span className="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                HR Verse
              </span>
            </MotionH1>

            <MotionP
              variants={fadeIn}
              className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
            >
              Accelerate your HR leadership trajectory through real-world case simulations, predictive talent acquisition, compensation modeling, and continuous Groq-powered AI coaching.
            </MotionP>

            <MotionDiv
              variants={fadeIn}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto gap-2 px-8 shadow-md">
                  Enroll in CHRMP <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/curriculum">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore 8-Week Roadmap
                </Button>
              </Link>
            </MotionDiv>

            {/* Quick Metrics */}
            <MotionDiv
              variants={fadeIn}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-12 border-t border-border/60"
            >
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground">8 Weeks</p>
                <p className="text-xs text-muted-foreground font-medium">Intensive Curriculum</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground">6 Modules</p>
                <p className="text-xs text-muted-foreground font-medium">Core HR Competencies</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground">40+ Quizzes</p>
                <p className="text-xs text-muted-foreground font-medium">Validating Mastery</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground">Groq AI</p>
                <p className="text-xs text-muted-foreground font-medium">24/7 Learning Mentor</p>
              </div>
            </MotionDiv>
          </MotionDiv>
        </div>
      </section>

      {/* Strategic Pillars Section */}
      <section className="py-20 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Built for Modern People Leaders
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Combining theoretical rigor with quantitative analytics and practical workplace simulations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-border/60 bg-card hover:border-primary/40 transition-all shadow-sm">
              <CardContent className="p-6 space-y-3">
                <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg text-foreground">Predictive Talent Acquisition</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Master Schmidt & Hunter predictive validity, structured STAR behavioral interviews, psychometric selection matrices, and multi-channel inbound sourcing.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border/60 bg-card hover:border-primary/40 transition-all shadow-sm">
              <CardContent className="p-6 space-y-3">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg text-foreground">Total Rewards & Comp Engineering</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Design salary structures, pay grades, range spreads, and calculate compa-ratios. Balance internal equity with external market benchmarks (P50/P75).
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border/60 bg-card hover:border-primary/40 transition-all shadow-sm">
              <CardContent className="p-6 space-y-3">
                <div className="h-10 w-10 rounded-lg bg-pink-500/10 text-pink-600 flex items-center justify-center">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg text-foreground">AI Learning Assistant</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Integrated Groq-powered AI tutor answers complex labor relations questions, reviews assignment drafts, and provides instant coaching around the clock.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Capstone Projects Highlight */}
      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-600">
                <Award className="h-3.5 w-3.5" />
                <span>Executive Capstones</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Graduate with Real Executive Portfolios
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Rather than memorizing abstract trivia, HR Verse students build two production-grade executive portfolios reviewed by industry administrators.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Capstone 1: Organizational HR Audit</h4>
                    <p className="text-xs text-muted-foreground">Conduct full FLSA, 4/5ths rule adverse impact, equal pay regression, and risk prioritization.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Capstone 2: Digital HR Transformation Blueprint</h4>
                    <p className="text-xs text-muted-foreground">Architect Ulrich operating models, People Analytics flight-risk models, and AI ethics charters.</p>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Link href="/register">
                  <Button className="gap-2 shadow-sm">
                    Begin Your Transformation <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-card p-8 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/80 pb-4">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Course Accreditation</span>
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">CHRMP Certified</span>
                </div>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-lg bg-card border border-border/60">
                    <p className="text-xs font-bold text-foreground">Week 1: Strategic Foundations & HR Planning</p>
                    <p className="text-[11px] text-muted-foreground">SHRM models, job analysis (TDRs/KSAOs), demand forecasting</p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-card border border-border/60">
                    <p className="text-xs font-bold text-foreground">Week 2: Total Rewards, Performance & ADDIE</p>
                    <p className="text-[11px] text-muted-foreground">Point-factor evaluation, compa-ratios, BARS, Knowles' andragogy</p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-card border border-border/60">
                    <p className="text-xs font-bold text-foreground">Assessments: ApexLogix & NovaHealth</p>
                    <p className="text-[11px] text-muted-foreground">Real-world case turnarounds and strategic board presentations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-5xl px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Lead the Future of People Operations?
          </h2>
          <p className="text-sm sm:text-base text-primary-foreground/80 max-w-xl mx-auto">
            Join hundreds of HR professionals, managers, and executives mastering modern data-driven HRM on HR Verse.
          </p>
          <div className="pt-2">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="font-bold text-primary gap-2 shadow-lg">
                Create Free Account <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
