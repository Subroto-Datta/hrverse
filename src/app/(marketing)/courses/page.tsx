import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, BookOpen, Award, ArrowRight, Check } from 'lucide-react'

export default function CoursesPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-16 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Course Catalog
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Flagship certification and continuous executive education programs designed for people leaders.
        </p>
      </div>

      {/* Featured Flagship Course */}
      <Card className="border border-primary/30 shadow-md overflow-hidden bg-card">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className="p-8 lg:col-span-2 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default" className="bg-primary text-primary-foreground">
                Flagship Program
              </Badge>
              <Badge variant="outline">Intermediate / Advanced</Badge>
              <Badge variant="secondary">8 Weeks</Badge>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Certified Human Resource Management Professional (CHRMP)
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                An exhaustive, executive-level certification covering Strategic Workforce Planning, Talent Acquisition, Total Rewards Engineering, Continuous Performance Management, Instructional Design (ADDIE), and People Analytics.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                <span>80+ Hours of Study</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>6 Deep-Dive Modules</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Award className="h-4 w-4 text-primary" />
                <span>2 Capstone Projects</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-border">
              <p className="text-xs font-semibold text-foreground">Key Outcomes:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Build Point-Factor salary bands & compa-ratios</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Implement STAR predictive behavioral interviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Execute Kirkpatrick Level 1-4 and Phillips ROI</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Deploy continuous OKRs and 360 feedback</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted/40 p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-border">
            <div className="space-y-4">
              <div>
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Tuition & Access</span>
                <div className="text-3xl font-extrabold text-foreground mt-1">Included</div>
                <p className="text-xs text-muted-foreground mt-0.5">Complimentary during platform beta</p>
              </div>

              <div className="space-y-2 text-xs text-muted-foreground pt-4 border-t border-border">
                <p>✓ Unlimited Groq AI Tutor Access</p>
                <p>✓ Interactive Lesson Quizzes</p>
                <p>✓ Written Strategy Evaluation</p>
                <p>✓ Verifiable Digital Certificate</p>
              </div>
            </div>

            <div className="pt-6">
              <Link href="/register" className="w-full">
                <Button className="w-full gap-2 shadow-sm">
                  Enroll Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
