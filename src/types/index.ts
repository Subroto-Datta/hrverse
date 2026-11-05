// Database types for HR Verse LMS

export type UserRole = 'student' | 'admin'

export interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  role: UserRole
  bio: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  title: string
  slug: string
  description: string
  thumbnail_url: string | null
  is_published: boolean
  duration_weeks: number
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  created_at: string
  updated_at: string
}

export interface Module {
  id: string
  course_id: string
  title: string
  description: string
  order_index: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Part {
  id: string
  module_id: string
  title: string
  description: string
  order_index: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: string
  part_id: string
  title: string
  slug: string
  content: string // Rich text JSON content
  summary: string | null
  order_index: number
  is_published: boolean
  estimated_minutes: number
  completion_type: 'read' | 'quiz' | 'assignment'
  created_at: string
  updated_at: string
}

export interface Quiz {
  id: string
  lesson_id: string | null
  module_id: string | null
  title: string
  description: string | null
  passing_score: number // Percentage 0-100
  time_limit_minutes: number | null
  max_attempts: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface QuizQuestion {
  id: string
  quiz_id: string
  question_text: string
  question_type: 'multiple_choice' | 'true_false' | 'short_answer'
  options: QuizOption[]
  correct_answer: string
  explanation: string | null
  points: number
  order_index: number
}

export interface QuizOption {
  id: string
  text: string
  is_correct: boolean
}

export interface QuizAttempt {
  id: string
  quiz_id: string
  student_id: string
  score: number
  total_points: number
  percentage: number
  passed: boolean
  answers: Record<string, string>
  started_at: string
  completed_at: string | null
  time_spent_seconds: number
}

export interface Assessment {
  id: string
  course_id: string
  module_id: string | null
  title: string
  description: string
  instructions: string
  rubric: AssessmentRubric[]
  max_score: number
  due_date: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface AssessmentRubric {
  criterion: string
  description: string
  max_points: number
}

export interface AssessmentSubmission {
  id: string
  assessment_id: string
  student_id: string
  content: string
  file_urls: string[]
  score: number | null
  feedback: string | null
  ai_feedback: string | null
  status: 'draft' | 'submitted' | 'graded' | 'returned'
  submitted_at: string | null
  graded_at: string | null
  graded_by: string | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  course_id: string
  title: string
  description: string
  instructions: string
  rubric: AssessmentRubric[]
  max_score: number
  due_date: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface ProjectSubmission {
  id: string
  project_id: string
  student_id: string
  content: string
  file_urls: string[]
  repository_url: string | null
  score: number | null
  feedback: string | null
  ai_feedback: string | null
  status: 'draft' | 'submitted' | 'graded' | 'returned'
  submitted_at: string | null
  graded_at: string | null
  graded_by: string | null
  created_at: string
  updated_at: string
}

export interface Enrollment {
  id: string
  student_id: string
  course_id: string
  progress_percentage: number
  status: 'active' | 'completed' | 'dropped'
  enrolled_at: string
  completed_at: string | null
}

export interface LessonProgress {
  id: string
  student_id: string
  lesson_id: string
  status: 'not_started' | 'in_progress' | 'completed'
  completed_at: string | null
  time_spent_seconds: number
  created_at: string
  updated_at: string
}

export interface LearningActivity {
  id: string
  student_id: string
  activity_type: 'lesson_view' | 'lesson_complete' | 'quiz_attempt' | 'assessment_submit' | 'project_submit' | 'ai_chat'
  resource_id: string
  resource_type: string
  metadata: Record<string, unknown>
  created_at: string
}

export interface AIConversation {
  id: string
  student_id: string
  lesson_id: string | null
  messages: AIMessage[]
  created_at: string
  updated_at: string
}

export interface AIMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface EmailReminder {
  id: string
  recipient_id: string
  subject: string
  body: string
  type: 'assessment_due' | 'quiz_reminder' | 'inactivity' | 'welcome' | 'custom'
  status: 'pending' | 'sent' | 'failed'
  scheduled_at: string
  sent_at: string | null
  created_at: string
}

// Dashboard analytics types
export interface DashboardMetrics {
  totalStudents: number
  activeStudents: number
  courseCompletionRate: number
  averageAssessmentScore: number
  quizPassRate: number
  studentsFallingBehind: number
  recentRegistrations: Profile[]
  recentSubmissions: AssessmentSubmission[]
  activityTrends: ActivityTrend[]
}

export interface ActivityTrend {
  date: string
  lessons_completed: number
  quizzes_taken: number
  assessments_submitted: number
}

export interface StudentPerformance {
  student: Profile
  enrollment: Enrollment
  lessonsCompleted: number
  totalLessons: number
  quizAverage: number
  assessmentAverage: number
  lastActive: string
  timeSpentHours: number
}

