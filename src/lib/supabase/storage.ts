import { createClient } from '@/lib/supabase/client'

/**
 * Uploads a student submission file to the private 'student-submissions' bucket
 * File path format: {userId}/{timestamp}-{filename}
 */
export async function uploadStudentSubmissionFile(
  file: File,
  userId: string
): Promise<{ path: string; publicUrl?: string; error?: string }> {
  const supabase = createClient()
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  const filePath = `${userId}/${Date.now()}-${cleanFileName}`

  const { data, error } = await supabase.storage
    .from('student-submissions')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    return { path: '', error: error.message }
  }

  return { path: data.path }
}

/**
 * Creates a temporary signed URL for viewing private student submissions
 */
export async function getSubmissionSignedUrl(
  path: string,
  expiresInSeconds: number = 3600
): Promise<string | null> {
  const supabase = createClient()
  const { data, error } = await supabase.storage
    .from('student-submissions')
    .createSignedUrl(path, expiresInSeconds)

  if (error || !data) {
    console.error('Failed to create signed URL:', error)
    return null
  }

  return data.signedUrl
}

/**
 * Uploads a course asset or thumbnail to the public 'course-assets' bucket
 */
export async function uploadCourseAsset(
  file: File,
  folder: string = 'thumbnails'
): Promise<{ url: string; error?: string }> {
  const supabase = createClient()
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  const filePath = `${folder}/${Date.now()}-${cleanFileName}`

  const { data, error } = await supabase.storage
    .from('course-assets')
    .upload(filePath, file, {
      cacheControl: '31536000',
      upsert: true,
    })

  if (error) {
    return { url: '', error: error.message }
  }

  const { data: urlData } = supabase.storage
    .from('course-assets')
    .getPublicUrl(data.path)

  return { url: urlData.publicUrl }
}

