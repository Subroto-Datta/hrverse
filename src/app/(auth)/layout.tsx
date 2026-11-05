import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20">
      <div className="mb-6">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent font-extrabold text-2xl">
            HR Verse
          </span>
        </Link>
      </div>
      <div className="w-full max-w-md">{children}</div>
      <div className="mt-8 text-center text-xs text-muted-foreground">
        AI-Powered Human Resource Management LMS
      </div>
    </div>
  )
}
