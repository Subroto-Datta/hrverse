import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/utils/auth'
import { StudentAnalyticsClient } from './student-analytics-client'

export default async function StudentAnalyticsPage() {
  const user = await getUser()
  const supabase = await createClient()

  // 1. Fetch user quiz attempts
  const { data: attempts } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('student_id', user?.id || '')
    .order('completed_at', { ascending: true })

  // 2. Fetch completed lessons count
  const { count: completedCount } = await supabase
    .from('lesson_progress')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', user?.id || '')
    .eq('status', 'completed')

  // 3. Total published lessons
  const { count: totalLessons } = await supabase
    .from('lessons')
    .select('id', { count: 'exact', head: true })
    .eq('is_published', true)

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-5xl mx-auto">
      <div className="border-b border-border pb-6 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Performance Analytics
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Visualize your learning velocity, quiz accuracy, and AI diagnostic insights.
        </p>
      </div>

      <StudentAnalyticsClient
        attempts={attempts || []}
        completedCount={completedCount || 0}
        totalLessons={totalLessons || 6}
      />
    </div>
  )
}

