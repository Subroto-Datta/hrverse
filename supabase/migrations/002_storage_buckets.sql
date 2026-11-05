-- HR VERSE SUPABASE STORAGE CONFIGURATION
-- Migration: 002_storage_buckets

-- 1. Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
(
  'course-assets',
  'course-assets',
  true,
  52428800, -- 50 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
),
(
  'student-submissions',
  'student-submissions',
  false,
  52428800, -- 50 MB
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'text/plain', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage RLS Policies for course-assets
-- Anyone can view course assets
CREATE POLICY "Public can view course assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'course-assets');

-- Admins can upload and manage course assets
CREATE POLICY "Admins can manage course assets"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'course-assets' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 3. Storage RLS Policies for student-submissions
-- Students can upload to their own folder: bucket_id = 'student-submissions' AND path starts with auth.uid()
CREATE POLICY "Students can upload own submissions"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'student-submissions' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Students can view their own submissions
CREATE POLICY "Students can view own submissions"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'student-submissions' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admins can view all student submissions
CREATE POLICY "Admins can view all student submissions"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'student-submissions' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
