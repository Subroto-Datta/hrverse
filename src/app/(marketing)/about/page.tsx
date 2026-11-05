import { Card, CardContent } from '@/components/ui/card'
import { Award, BookOpen, BrainCircuit, Globe, Shield, Users } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-16 space-y-16">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          About HR Verse
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          HR Verse was founded on a simple conviction: modern human resource management requires the precision of data science, the empathy of human psychology, and the strategic vision of executive leadership.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border border-border/60">
          <CardContent className="p-8 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">AI-Powered Pedagogy</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We leverage large language models via the ultra-fast Groq API to provide personalized 1-on-1 tutoring, rapid feedback on strategy essays, and dynamic case scenario analysis tailored to each learner's pace.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/60">
          <CardContent className="p-8 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Industry Accreditation Standards</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our curriculum adheres to globally recognized bodies of knowledge including SHRM (Society for Human Resource Management), HRCI (HR Certification Institute), and WorldatWork Total Rewards frameworks.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Core Educational Values */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground tracking-tight text-center">
          Our Educational Philosophy
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-border/60 bg-muted/20 space-y-2">
            <Shield className="h-6 w-6 text-primary mb-2" />
            <h4 className="font-semibold text-sm text-foreground">Evidence-Based Practice</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every concept taught—from Schmidt & Hunter selection validity to Point-Factor compensable evaluation—is grounded in empirical organizational research.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border/60 bg-muted/20 space-y-2">
            <Globe className="h-6 w-6 text-primary mb-2" />
            <h4 className="font-semibold text-sm text-foreground">Global Applicability</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Case studies and legal guidelines span multinational contexts, addressing remote, distributed, and hybrid workforce architectures worldwide.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border/60 bg-muted/20 space-y-2">
            <BookOpen className="h-6 w-6 text-primary mb-2" />
            <h4 className="font-semibold text-sm text-foreground">Active Problem-Solving</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Learners do not just passively watch videos; they solve real turnarounds (NovaHealth), audit synthetic payrolls, and build executive board presentations.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

