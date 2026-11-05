import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import { LessonEditorClient } from './lesson-editor-client'

export default async function AdminLessonEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !lesson) {
    notFound()
  }

  return <LessonEditorClient lesson={lesson} />
}

