-- ============================================================================
-- HR VERSE: RLS FIX SCRIPT - RESOLVES INFINITE RECURSION (CODE 42P17)
-- Run this in your Supabase SQL Editor to immediately fix all tables.
-- ============================================================================

-- 1. Create a SECURITY DEFINER function to check admin role without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Grant execution to authenticated & anon
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- 2. Drop existing problematic recursive policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

DROP POLICY IF EXISTS "Authenticated users can view published courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can manage courses" ON public.courses;

DROP POLICY IF EXISTS "Authenticated users can view published modules" ON public.modules;
DROP POLICY IF EXISTS "Admins can manage modules" ON public.modules;

DROP POLICY IF EXISTS "Authenticated users can view published parts" ON public.parts;
DROP POLICY IF EXISTS "Admins can manage parts" ON public.parts;

DROP POLICY IF EXISTS "Authenticated users can view published lessons" ON public.lessons;
DROP POLICY IF EXISTS "Admins can manage lessons" ON public.lessons;

DROP POLICY IF EXISTS "Authenticated users can view published quizzes" ON public.quizzes;
DROP POLICY IF EXISTS "Admins can manage quizzes" ON public.quizzes;

DROP POLICY IF EXISTS "Authenticated users can view questions of published quizzes" ON public.quiz_questions;
DROP POLICY IF EXISTS "Admins can manage quiz questions" ON public.quiz_questions;

DROP POLICY IF EXISTS "Authenticated users can view published assessments" ON public.assessments;
DROP POLICY IF EXISTS "Admins can manage assessments" ON public.assessments;

DROP POLICY IF EXISTS "Authenticated users can view published projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can manage projects" ON public.projects;

DROP POLICY IF EXISTS "Admins can view all quiz attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Admins can manage all assessment submissions" ON public.assessment_submissions;
DROP POLICY IF EXISTS "Admins can manage all project submissions" ON public.project_submissions;
DROP POLICY IF EXISTS "Admins can manage all enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Admins can view all lesson progress" ON public.lesson_progress;
DROP POLICY IF EXISTS "Admins can view all activities" ON public.learning_activities;
DROP POLICY IF EXISTS "Admins can view all AI conversations" ON public.ai_conversations;
DROP POLICY IF EXISTS "Admins can manage email reminders" ON public.email_reminders;

-- ============================================================================
-- 3. RE-CREATE CLEAN, HIGH-PERFORMANCE POLICIES
-- ============================================================================

-- PROFILES:
-- Users can view their own profile, or admins can view all profiles
CREATE POLICY "Users and admins can view profiles"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin());

-- COURSES:
-- Anyone can view published courses (both authenticated & visitors)
CREATE POLICY "Anyone can view published courses"
  ON public.courses FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage courses"
  ON public.courses FOR ALL
  USING (public.is_admin());

-- MODULES:
CREATE POLICY "Anyone can view published modules"
  ON public.modules FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage modules"
  ON public.modules FOR ALL
  USING (public.is_admin());

-- PARTS:
CREATE POLICY "Anyone can view published parts"
  ON public.parts FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage parts"
  ON public.parts FOR ALL
  USING (public.is_admin());

-- LESSONS:
CREATE POLICY "Anyone can view published lessons"
  ON public.lessons FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage lessons"
  ON public.lessons FOR ALL
  USING (public.is_admin());

-- QUIZZES:
CREATE POLICY "Anyone can view published quizzes"
  ON public.quizzes FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage quizzes"
  ON public.quizzes FOR ALL
  USING (public.is_admin());

-- QUIZ QUESTIONS:
CREATE POLICY "Anyone can view questions of published quizzes"
  ON public.quiz_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes
      WHERE id = quiz_id AND is_published = true
    )
  );

CREATE POLICY "Admins can manage quiz questions"
  ON public.quiz_questions FOR ALL
  USING (public.is_admin());

-- ASSESSMENTS:
CREATE POLICY "Anyone can view published assessments"
  ON public.assessments FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage assessments"
  ON public.assessments FOR ALL
  USING (public.is_admin());

-- PROJECTS:
CREATE POLICY "Anyone can view published projects"
  ON public.projects FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage projects"
  ON public.projects FOR ALL
  USING (public.is_admin());

-- ATTEMPTS, PROGRESS & SUBMISSIONS (Admin policies):
CREATE POLICY "Admins can view all quiz attempts"
  ON public.quiz_attempts FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can manage all assessment submissions"
  ON public.assessment_submissions FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admins can manage all project submissions"
  ON public.project_submissions FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admins can manage all enrollments"
  ON public.enrollments FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admins can view all lesson progress"
  ON public.lesson_progress FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can view all activities"
  ON public.learning_activities FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can view all AI conversations"
  ON public.ai_conversations FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can manage email reminders"
  ON public.email_reminders FOR ALL
  USING (public.is_admin());

