import { getProfile } from '@/lib/utils/auth'
import { StudentLayoutClient } from './student-layout-client'

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getProfile()

  return (
    <StudentLayoutClient profile={profile}>
      {children}
    </StudentLayoutClient>
  )
}
