import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  ArrowRight,
  Target,
  BarChart3,
  Award,
  CheckCircle2,
  Compass,
  Building2,
  ShieldCheck,
} from 'lucide-react'
import { MotionDiv, MotionH1, MotionP, fadeIn, staggerContainer } from '@/components/layout/motion-wrapper'

export default function LandingPage() {
  return (
    <div className="flex flex-col relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 border-b border-border">
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
              <Compass className="h-3.5 w-3.5 text-primary" />
              <span>Applied Human Resource Leadership Academy</span>
            </MotionDiv>

            <MotionH1
              variants={fadeIn}
              className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.12]"
            >
              Master Applied Human Resources with{' '}
              <span className="text-primary italic">HR Verse</span>
            </MotionH1>

            <MotionP
              variants={fadeIn}
              className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto font-sans"
            >
              Master strategic people operations through real-world hospital operational simulations, predictive talent acquisition, statutory labor compliance, and executive faculty mentorship.
            </MotionP>

            <MotionDiv
              variants={fadeIn}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto gap-2 px-8 font-semibold shadow-xs">
                  Enroll in CHRMP Fellowship <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/curriculum">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore 14-Day Syllabus
                </Button>
              </Link>
            </MotionDiv>

            {/* Quick Metrics */}
            <MotionDiv
              variants={fadeIn}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-12 border-t border-border"
            >
              <div>
                <p className="font-serif text-3xl font-bold text-foreground">14 Days</p>
                <p className="text-xs text-muted-foreground font-medium">Applied Coursework</p>
              </div>
              <div>
                <p className="font-serif text-3xl font-bold text-foreground">13 Roles</p>
                <p className="text-xs text-muted-foreground font-medium">Hospital Hiring Pipeline</p>
              </div>
              <div>
                <p className="font-serif text-3xl font-bold text-foreground">100 Pts</p>
                <p className="text-xs text-muted-foreground font-medium">Executive Capstone Rubric</p>
              </div>
              <div>
                <p className="font-serif text-3xl font-bold text-foreground">CHRMP</p>
                <p className="text-xs text-muted-foreground font-medium">Certified Accreditation</p>
              </div>
            </MotionDiv>
          </MotionDiv>
        </div>
      </section>

      {/* Strategic Pillars Section */}
      <section className="py-20 bg-muted/20 border-b border-border">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Engineered for Modern People Executives
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Combining theoretical foundations with quantitative workforce analytics and practical workplace simulations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-border bg-card shadow-xs">
              <CardContent className="p-6 space-y-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="font-serif font-bold text-lg text-foreground">Predictive Talent Acquisition</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Master Schmidt & Hunter predictive validity, structured STAR behavioral interviews, psychometric selection scorecards, and multi-channel candidate pipelines.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card shadow-xs">
              <CardContent className="p-6 space-y-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Building2 className="h-5 w-5" />
                </div>
                <h3 className="font-serif font-bold text-lg text-foreground">Hospital & Enterprise HR Operations</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Navigate 24/7 rotational shifts, NABH clinical accreditation compliance, nursing council registries, and specialized medical department staffing quotas.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card shadow-xs">
              <CardContent className="p-6 space-y-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-serif font-bold text-lg text-foreground">Faculty Advisory & Legal Precedents</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Consult senior faculty guidance on statutory employment disputes, attrition formula calculations, ATS shortlisting, and candidate negotiation strategies.
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
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary font-mono">
                <Award className="h-3.5 w-3.5" />
                <span>Executive Portfolios</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Graduate with Tangible Operational Frameworks
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Rather than memorizing abstract trivia, HR Verse fellows construct comprehensive executive portfolios reviewed against standard organizational rubrics.
              </p>
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Week 1 Capstone: 100-Employee Hospital HR Framework</h4>
                    <p className="text-xs text-muted-foreground">Develop attendance tracking, 30-day onboarding checklists, and 8 core statutory policies.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Week 2 Capstone: 200-Bed Hospital Recruitment Portfolio</h4>
                    <p className="text-xs text-muted-foreground">Execute 7 core deliverables across 13 clinical vacancies including Boolean search, scorecards, and yield ratios.</p>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Link href="/register">
                  <Button className="gap-2 font-semibold">
                    Begin Fellowship Application <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8 shadow-xs">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">Curriculum Syllabus</span>
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded font-mono">CHRMP Accredited</span>
                </div>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-lg bg-muted/30 border border-border">
                    <p className="text-xs font-bold text-foreground">Module 1: HR Fundamentals & Healthcare Operations</p>
                    <p className="text-[11px] text-muted-foreground">Days 1–7: Department structure, employee lifecycle, hospital shifts, and compliance policies</p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-muted/30 border border-border">
                    <p className="text-xs font-bold text-foreground">Module 2: Recruitment & Talent Acquisition</p>
                    <p className="text-[11px] text-muted-foreground">Days 8–14: Job analysis, candidate sourcing, ATS screening, structured interviews, and salary offers</p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-muted/30 border border-border">
                    <p className="text-xs font-bold text-foreground">Evaluations: 50-Mark Comprehensive Assessments</p>
                    <p className="text-[11px] text-muted-foreground">Rigorous situational judgment evaluations with 70% passing threshold</p>
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
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
            Ready to Lead Applied People Operations?
          </h2>
          <p className="text-sm sm:text-base text-primary-foreground/90 max-w-xl mx-auto">
            Join professionals and hospital administrators mastering modern people operations on HR Verse.
          </p>
          <div className="pt-2">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="font-bold text-primary gap-2 shadow-md">
                Enroll in the Academy <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
