import { getUser } from '@/lib/utils/auth'
import {
  getProjectById,
  getStudentProjectSubmissions,
} from '@/lib/content/get-content'
import { notFound } from 'next/navigation'
import { ProjectDetailClient } from './project-detail-client'

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getUser()

  // 1. Fetch project safely
  const project = await getProjectById(id)

  if (!project) {
    notFound()
  }

  // 2. Fetch student's submission safely
  const submissions = await getStudentProjectSubmissions(user?.id || '')
  const submission = submissions.find((s: any) => s.project_id === id) || null

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto">
      <ProjectDetailClient project={project} submission={submission} />
    </div>
  )
}
