import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-muted/30 py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span>HR Verse</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The premier AI-powered Human Resource Management Learning Management System. Equipping modern leaders with data-driven strategic talent mastery.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
              Curriculum
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/courses" className="hover:text-foreground">Strategic HRM</Link></li>
              <li><Link href="/courses" className="hover:text-foreground">Workforce Planning</Link></li>
              <li><Link href="/courses" className="hover:text-foreground">Predictive Talent Acquisition</Link></li>
              <li><Link href="/courses" className="hover:text-foreground">Compensation & Total Rewards</Link></li>
              <li><Link href="/courses" className="hover:text-foreground">Performance & OKRs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground">About the Program</Link></li>
              <li><Link href="/curriculum" className="hover:text-foreground">8-Week Roadmap</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground">Student Portal</Link></li>
              <li><Link href="/admin" className="hover:text-foreground">Admin Access</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
              Legal & Technology
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>Next.js App Router & SSR</li>
              <li>Supabase PostgreSQL & Auth</li>
              <li>Groq LLM AI Engine</li>
              <li>Tailwind CSS & shadcn/ui</li>
              <li className="pt-2 text-[10px]">© 2026 HR Verse. All rights reserved.</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
