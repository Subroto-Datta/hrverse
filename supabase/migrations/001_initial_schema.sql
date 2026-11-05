-- HR Verse LMS Database Schema
-- Migration: 001_initial_schema

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  bio TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- COURSES TABLE
-- ============================================
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  thumbnail_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  duration_weeks INTEGER NOT NULL DEFAULT 8,
  difficulty_level TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- MODULES TABLE
-- ============================================
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  order_index INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- PARTS TABLE
-- ============================================
CREATE TABLE public.parts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  order_index INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- LESSONS TABLE
-- ============================================
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_id UUID NOT NULL REFERENCES public.parts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  summary TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  estimated_minutes INTEGER NOT NULL DEFAULT 15,
  completion_type TEXT NOT NULL DEFAULT 'read' CHECK (completion_type IN ('read', 'quiz', 'assignment')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(part_id, slug)
);

-- ============================================
-- QUIZZES TABLE
-- ============================================
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  module_id UUID REFERENCES public.modules(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  passing_score INTEGER NOT NULL DEFAULT 70 CHECK (passing_score >= 0 AND passing_score <= 100),
  time_limit_minutes INTEGER,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- QUIZ QUESTIONS TABLE
-- ============================================
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer')),
  options JSONB NOT NULL DEFAULT '[]',
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  points INTEGER NOT NULL DEFAULT 1,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- ============================================
-- QUIZ ATTEMPTS TABLE
-- ============================================
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  total_points INTEGER NOT NULL DEFAULT 0,
  percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  passed BOOLEAN NOT NULL DEFAULT false,
  answers JSONB NOT NULL DEFAULT '{}',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER NOT NULL DEFAULT 0
);

-- ============================================
-- ASSESSMENTS TABLE
-- ============================================
CREATE TABLE public.assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES public.modules(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  instructions TEXT NOT NULL DEFAULT '',
  rubric JSONB NOT NULL DEFAULT '[]',
  max_score INTEGER NOT NULL DEFAULT 100,
  due_date TIMESTAMPTZ,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- ASSESSMENT SUBMISSIONS TABLE
-- ============================================
CREATE TABLE public.assessment_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL DEFAULT '',
  file_urls JSONB NOT NULL DEFAULT '[]',
  score INTEGER,
  feedback TEXT,
  ai_feedback TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'graded', 'returned')),
  submitted_at TIMESTAMPTZ,
  graded_at TIMESTAMPTZ,
  graded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  instructions TEXT NOT NULL DEFAULT '',
  rubric JSONB NOT NULL DEFAULT '[]',
  max_score INTEGER NOT NULL DEFAULT 100,
  due_date TIMESTAMPTZ,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- PROJECT SUBMISSIONS TABLE
-- ============================================
CREATE TABLE public.project_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL DEFAULT '',
  file_urls JSONB NOT NULL DEFAULT '[]',
  repository_url TEXT,
  score INTEGER,
  feedback TEXT,
  ai_feedback TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'graded', 'returned')),
  submitted_at TIMESTAMPTZ,
  graded_at TIMESTAMPTZ,
  graded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- ENROLLMENTS TABLE
-- ============================================
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  progress_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(student_id, course_id)
);

-- ============================================
-- LESSON PROGRESS TABLE
-- ============================================
CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  completed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, lesson_id)
);

-- ============================================
-- LEARNING ACTIVITIES TABLE
-- ============================================
CREATE TABLE public.learning_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('lesson_view', 'lesson_complete', 'quiz_attempt', 'assessment_submit', 'project_submit', 'ai_chat')),
  resource_id UUID NOT NULL,
  resource_type TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- AI CONVERSATIONS TABLE
-- ============================================
CREATE TABLE public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- EMAIL REMINDERS TABLE
-- ============================================
CREATE TABLE public.email_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('assessment_due', 'quiz_reminder', 'inactivity', 'welcome', 'custom')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  scheduled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_modules_course_id ON public.modules(course_id);
CREATE INDEX idx_modules_order ON public.modules(course_id, order_index);
CREATE INDEX idx_parts_module_id ON public.parts(module_id);
CREATE INDEX idx_parts_order ON public.parts(module_id, order_index);
CREATE INDEX idx_lessons_part_id ON public.lessons(part_id);
CREATE INDEX idx_lessons_order ON public.lessons(part_id, order_index);
CREATE INDEX idx_lessons_slug ON public.lessons(slug);
CREATE INDEX idx_quizzes_lesson_id ON public.quizzes(lesson_id);
CREATE INDEX idx_quizzes_module_id ON public.quizzes(module_id);
CREATE INDEX idx_quiz_questions_quiz_id ON public.quiz_questions(quiz_id);
CREATE INDEX idx_quiz_attempts_student ON public.quiz_attempts(student_id);
CREATE INDEX idx_quiz_attempts_quiz ON public.quiz_attempts(quiz_id);
CREATE INDEX idx_assessments_course_id ON public.assessments(course_id);
CREATE INDEX idx_assessment_submissions_student ON public.assessment_submissions(student_id);
CREATE INDEX idx_assessment_submissions_assessment ON public.assessment_submissions(assessment_id);
CREATE INDEX idx_projects_course_id ON public.projects(course_id);
CREATE INDEX idx_project_submissions_student ON public.project_submissions(student_id);
CREATE INDEX idx_enrollments_student ON public.enrollments(student_id);
CREATE INDEX idx_enrollments_course ON public.enrollments(course_id);
CREATE INDEX idx_lesson_progress_student ON public.lesson_progress(student_id);
CREATE INDEX idx_lesson_progress_lesson ON public.lesson_progress(lesson_id);
CREATE INDEX idx_learning_activities_student ON public.learning_activities(student_id);
CREATE INDEX idx_learning_activities_type ON public.learning_activities(activity_type);
CREATE INDEX idx_learning_activities_created ON public.learning_activities(created_at);
CREATE INDEX idx_ai_conversations_student ON public.ai_conversations(student_id);
CREATE INDEX idx_email_reminders_recipient ON public.email_reminders(recipient_id);
CREATE INDEX idx_email_reminders_status ON public.email_reminders(status);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'student'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_modules_updated_at
  BEFORE UPDATE ON public.modules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_parts_updated_at
  BEFORE UPDATE ON public.parts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at
  BEFORE UPDATE ON public.quizzes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON public.assessments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assessment_submissions_updated_at
  BEFORE UPDATE ON public.assessment_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_submissions_updated_at
  BEFORE UPDATE ON public.project_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lesson_progress_updated_at
  BEFORE UPDATE ON public.lesson_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_conversations_updated_at
  BEFORE UPDATE ON public.ai_conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_reminders ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can update their own profile (but not role)
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

-- ============================================
-- COURSES POLICIES
-- ============================================
-- Anyone authenticated can view published courses
CREATE POLICY "Authenticated users can view published courses"
  ON public.courses FOR SELECT
  USING (is_published = true);

-- Admins can do everything with courses
CREATE POLICY "Admins can manage courses"
  ON public.courses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- MODULES POLICIES
-- ============================================
CREATE POLICY "Authenticated users can view published modules"
  ON public.modules FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage modules"
  ON public.modules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- PARTS POLICIES
-- ============================================
CREATE POLICY "Authenticated users can view published parts"
  ON public.parts FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage parts"
  ON public.parts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- LESSONS POLICIES
-- ============================================
CREATE POLICY "Authenticated users can view published lessons"
  ON public.lessons FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage lessons"
  ON public.lessons FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- QUIZZES POLICIES
-- ============================================
CREATE POLICY "Authenticated users can view published quizzes"
  ON public.quizzes FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage quizzes"
  ON public.quizzes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- QUIZ QUESTIONS POLICIES
-- ============================================
CREATE POLICY "Authenticated users can view questions of published quizzes"
  ON public.quiz_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes
      WHERE id = quiz_id AND is_published = true
    )
  );

CREATE POLICY "Admins can manage quiz questions"
  ON public.quiz_questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- QUIZ ATTEMPTS POLICIES
-- ============================================
CREATE POLICY "Students can view own quiz attempts"
  ON public.quiz_attempts FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Students can insert own quiz attempts"
  ON public.quiz_attempts FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own quiz attempts"
  ON public.quiz_attempts FOR UPDATE
  USING (student_id = auth.uid());

CREATE POLICY "Admins can view all quiz attempts"
  ON public.quiz_attempts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- ASSESSMENTS POLICIES
-- ============================================
CREATE POLICY "Authenticated users can view published assessments"
  ON public.assessments FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage assessments"
  ON public.assessments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- ASSESSMENT SUBMISSIONS POLICIES
-- ============================================
CREATE POLICY "Students can view own assessment submissions"
  ON public.assessment_submissions FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Students can insert own assessment submissions"
  ON public.assessment_submissions FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own draft submissions"
  ON public.assessment_submissions FOR UPDATE
  USING (student_id = auth.uid() AND status = 'draft');

CREATE POLICY "Admins can manage all assessment submissions"
  ON public.assessment_submissions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- PROJECTS POLICIES
-- ============================================
CREATE POLICY "Authenticated users can view published projects"
  ON public.projects FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage projects"
  ON public.projects FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- PROJECT SUBMISSIONS POLICIES
-- ============================================
CREATE POLICY "Students can view own project submissions"
  ON public.project_submissions FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Students can insert own project submissions"
  ON public.project_submissions FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own draft project submissions"
  ON public.project_submissions FOR UPDATE
  USING (student_id = auth.uid() AND status = 'draft');

CREATE POLICY "Admins can manage all project submissions"
  ON public.project_submissions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- ENROLLMENTS POLICIES
-- ============================================
CREATE POLICY "Students can view own enrollments"
  ON public.enrollments FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Students can enroll themselves"
  ON public.enrollments FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Admins can manage all enrollments"
  ON public.enrollments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- LESSON PROGRESS POLICIES
-- ============================================
CREATE POLICY "Students can view own lesson progress"
  ON public.lesson_progress FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Students can insert own lesson progress"
  ON public.lesson_progress FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own lesson progress"
  ON public.lesson_progress FOR UPDATE
  USING (student_id = auth.uid());

CREATE POLICY "Admins can view all lesson progress"
  ON public.lesson_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- LEARNING ACTIVITIES POLICIES
-- ============================================
CREATE POLICY "Students can view own activities"
  ON public.learning_activities FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Students can insert own activities"
  ON public.learning_activities FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Admins can view all activities"
  ON public.learning_activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- AI CONVERSATIONS POLICIES
-- ============================================
CREATE POLICY "Students can view own AI conversations"
  ON public.ai_conversations FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Students can insert own AI conversations"
  ON public.ai_conversations FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own AI conversations"
  ON public.ai_conversations FOR UPDATE
  USING (student_id = auth.uid());

CREATE POLICY "Admins can view all AI conversations"
  ON public.ai_conversations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- EMAIL REMINDERS POLICIES
-- ============================================
CREATE POLICY "Admins can manage email reminders"
  ON public.email_reminders FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can view own email reminders"
  ON public.email_reminders FOR SELECT
  USING (recipient_id = auth.uid());

