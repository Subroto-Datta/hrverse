import { getAdminDashboardMetrics } from '@/lib/analytics/data'
import { AdminDashboardClient } from '../admin-dashboard-client'

export default async function AdminDashboardPage() {
  const metrics = await getAdminDashboardMetrics()

  return <AdminDashboardClient metrics={metrics} />
}
