import { createClient } from '@/lib/supabase/server'
import { SubmissionsClient } from './submissions-client'

export default async function AdminSubmissionsPage() {
  const supabase = await createClient()

  // Fetch assessment submissions with student profile and assessment title
  const { data: assessments } = await supabase
    .from('assessment_submissions')
    .select('*, profiles(full_name, email), assessments(title, max_score)')
    .order('submitted_at', { ascending: false })

  // Fetch project submissions with student profile and project title
  const { data: projects } = await supabase
    .from('project_submissions')
    .select('*, profiles(full_name, email), projects(title, max_score)')
    .order('submitted_at', { ascending: false })

  return (
    <SubmissionsClient
      assessments={(assessments as unknown as Parameters<typeof SubmissionsClient>[0]['assessments']) || []}
      projects={(projects as unknown as Parameters<typeof SubmissionsClient>[0]['projects']) || []}
    />
  )
}

