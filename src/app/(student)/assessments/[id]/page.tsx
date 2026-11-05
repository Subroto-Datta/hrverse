import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/utils/auth'
import { notFound } from 'next/navigation'
import { AssessmentDetailClient } from './assessment-detail-client'

export default async function AssessmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getUser()
  const supabase = await createClient()

  // 1. Fetch assessment
  const { data: assessment, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !assessment) {
    notFound()
  }

  // 2. Fetch student's submission (if any)
  const { data: submission } = await supabase
    .from('assessment_submissions')
    .select('*')
    .eq('assessment_id', id)
    .eq('student_id', user?.id || '')
    .single()

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto">
      <AssessmentDetailClient assessment={assessment} submission={submission} />
    </div>
  )
}

