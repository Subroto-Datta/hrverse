import { getUser } from '@/lib/utils/auth'
import {
  getAssessmentById,
  getStudentAssessmentSubmissions,
} from '@/lib/content/get-content'
import { notFound } from 'next/navigation'
import { AssessmentDetailClient } from './assessment-detail-client'

export default async function AssessmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getUser()

  // 1. Fetch assessment safely
  const assessment = await getAssessmentById(id)

  if (!assessment) {
    notFound()
  }

  // 2. Fetch student's submission safely
  const submissions = await getStudentAssessmentSubmissions(user?.id || '')
  const submission = submissions.find((s: any) => s.assessment_id === id) || null

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto">
      <AssessmentDetailClient assessment={assessment} submission={submission} />
    </div>
  )
}
