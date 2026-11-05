'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Layers,
  FileText,
  HelpCircle,
  ClipboardCheck,
  Inbox,
  BarChart3,
  Sparkles,
  Settings,
  ShieldCheck,
  LogOut,
  Mail,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signout } from '@/actions/auth'
import type { Profile } from '@/types'

const adminNavItems = [
  { title: 'Admin Dashboard', href: '/admin', icon: LayoutDashboard },
  { title: 'Student Management', href: '/admin/students', icon: Users },
  { title: 'Course Management', href: '/admin/courses', icon: GraduationCap },
  { title: 'Module & Parts', href: '/admin/modules', icon: Layers },
  { title: 'Lesson Editor', href: '/admin/lessons', icon: FileText },
  { title: 'Quiz Management', href: '/admin/quizzes', icon: HelpCircle },
  { title: 'Assessments', href: '/admin/assessments', icon: ClipboardCheck },
  { title: 'Submissions & Grading', href: '/admin/submissions', icon: Inbox },
  { title: 'Performance Analytics', href: '/admin/analytics', icon: BarChart3 },
  { title: 'AI Insights', href: '/admin/ai-insights', icon: Sparkles },
  { title: 'Email Reminders', href: '/admin/emails', icon: Mail },
  { title: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar({ profile }: { profile: Profile | null }) {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-border bg-slate-950 text-slate-100 flex flex-col h-screen sticky top-0">
      {/* Brand Header with Admin Badge */}
      <div className="h-16 border-b border-slate-800 flex items-center px-6 gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-base tracking-tight leading-none text-white">
            HR Verse
          </span>
          <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mt-0.5">
            Admin Portal
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {adminNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.title}</span>
            </Link>
          )
        })}
      </div>

      {/* Footer Profile & Logout */}
      <div className="border-t border-slate-800 p-4 bg-slate-950/80">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs border border-purple-500/30">
            {profile?.full_name ? profile.full_name[0].toUpperCase() : 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate text-white">
              {profile?.full_name || 'System Administrator'}
            </p>
            <p className="text-[10px] truncate text-purple-400 font-medium">
              Super Admin
            </p>
          </div>
        </div>
        <form action={signout}>
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs text-slate-400 hover:text-red-400 hover:bg-red-950/30 gap-2 h-8"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </Button>
        </form>
      </div>
    </aside>
  )
}

