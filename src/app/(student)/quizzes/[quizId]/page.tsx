import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { QuizRunner } from './quiz-runner'

export default async function QuizRunnerPage({
  params,
}: {
  params: Promise<{ quizId: string }>
}) {
  const { quizId } = await params
  const supabase = await createClient()

  // 1. Fetch quiz metadata
  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .select('*')
    .eq('id', quizId)
    .single()

  if (quizError || !quiz) {
    notFound()
  }

  // 2. Fetch quiz questions (options only, NOT leaking correct answers to client)
  const { data: questions, error: qError } = await supabase
    .from('quiz_questions')
    .select('id, question_text, options, points, order_index')
    .eq('quiz_id', quizId)
    .order('order_index', { ascending: true })

  if (qError || !questions) {
    notFound()
  }

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto">
      <QuizRunner quiz={quiz} questions={questions} />
    </div>
  )
}

