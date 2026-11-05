import { createAdminClient } from '@/lib/supabase/admin'
import { LessonsListClient } from './lessons-list-client'

export default async function AdminLessonsPage() {
  const supabase = createAdminClient()

  // Fetch all lessons with part & module titles
  const { data: lessons } = await supabase
    .from('lessons')
    .select('*, parts(*, modules(*))')
    .order('order_index', { ascending: true })

  return <LessonsListClient lessons={lessons || []} />
}

