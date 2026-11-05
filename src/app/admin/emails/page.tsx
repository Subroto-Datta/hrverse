import { createAdminClient } from '@/lib/supabase/admin'
import { EmailManagementClient } from './email-management-client'
import { Mail } from 'lucide-react'

export default async function AdminEmailsPage() {
  const supabase = createAdminClient()

  const { data: students } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('role', 'student')
    .order('full_name', { ascending: true })

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-slate-800 pb-6 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <Mail className="h-6 w-6 text-purple-400" /> Email Reminder Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Orchestrate automated notifications, due date alerts, and re-engagement campaigns powered by Resend.
        </p>
      </div>

      <EmailManagementClient students={students || []} />
    </div>
  )
}

