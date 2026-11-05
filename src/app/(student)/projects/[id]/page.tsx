import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/utils/auth'
import { notFound } from 'next/navigation'
import { ProjectDetailClient } from './project-detail-client'

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getUser()
  const supabase = await createClient()

  // 1. Fetch project
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !project) {
    notFound()
  }

  // 2. Fetch student's submission (if any)
  const { data: submission } = await supabase
    .from('project_submissions')
    .select('*')
    .eq('project_id', id)
    .eq('student_id', user?.id || '')
    .single()

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto">
      <ProjectDetailClient project={project} submission={submission} />
    </div>
  )
}

