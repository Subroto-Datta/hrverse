import { requireAdmin } from '@/lib/utils/auth'
import { AdminSidebar } from '@/components/layout/admin-nav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Enforces server-side authorization: throws redirect to /dashboard if role !== 'admin'
  const profile = await requireAdmin()

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      <AdminSidebar profile={profile} />
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900/50">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
