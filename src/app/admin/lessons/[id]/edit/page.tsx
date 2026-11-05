import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { LessonEditorClient } from './lesson-editor-client'

export default async function AdminLessonEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

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

