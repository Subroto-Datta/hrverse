'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Map,
  BookOpen,
  HelpCircle,
  ClipboardCheck,
  FolderKanban,
  BarChart3,
  Settings,
  GraduationCap,
  LogOut,
  Sparkles,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signout } from '@/actions/auth'
import type { Profile } from '@/types'
import { ThemeToggle } from '@/components/ui/theme-toggle'

const studentNavItems = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Course Roadmap', href: '/roadmap', icon: Map },
  { title: 'Learning Workspace', href: '/learn', icon: BookOpen },
  { title: 'Quizzes', href: '/quizzes', icon: HelpCircle },
  { title: 'Assessments', href: '/assessments', icon: ClipboardCheck },
  { title: 'Projects', href: '/projects', icon: FolderKanban },
  { title: 'Performance Analytics', href: '/analytics', icon: BarChart3 },
  { title: 'Settings', href: '/settings', icon: Settings },
]

export function StudentSidebar({
  profile,
  onOpenAIChat,
}: {
  profile: Profile | null
  onOpenAIChat?: () => void
}) {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-border bg-card/60 backdrop-blur flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="h-16 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-amber-500/20">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight leading-none bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 bg-clip-text text-transparent">
              HR Verse
            </span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
              Student Portal
            </span>
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {studentNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-amber-500/20 font-semibold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          )
        })}

        {/* AI Assistant Quick Launcher */}
        <div className="pt-4 mt-4 border-t border-border">
          <button
            onClick={onOpenAIChat}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-400/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 hover:border-amber-500/40 transition-all text-left group"
          >
            <Sparkles className="h-4 w-4 text-amber-500 group-hover:scale-110 transition-transform" />
            <span className="flex-1">AI HR Assistant</span>
            <span className="text-[10px] uppercase font-bold bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-600 dark:text-amber-300">
              Groq
            </span>
          </button>
        </div>
      </div>

      {/* Footer Profile & Logout */}
      <div className="border-t border-border p-4 bg-card/80">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs border border-primary/20">
            {profile?.full_name ? profile.full_name[0].toUpperCase() : <User className="h-4 w-4" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate text-foreground">
              {profile?.full_name || 'Enrolled Student'}
            </p>
            <p className="text-[11px] truncate text-muted-foreground">
              {profile?.email || 'student@hrverse.com'}
            </p>
          </div>
        </div>
        <form action={signout}>
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-2 h-8"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </Button>
        </form>
      </div>
    </aside>
  )
}

