import { getQuizById, getQuizQuestions } from '@/lib/content/get-content'
import { notFound } from 'next/navigation'
import { QuizRunner } from './quiz-runner'

export default async function QuizRunnerPage({
  params,
}: {
  params: Promise<{ quizId: string }>
}) {
  const { quizId } = await params

  // 1. Fetch quiz metadata safely
  const quiz = await getQuizById(quizId)

  if (!quiz) {
    notFound()
  }

  // 2. Fetch quiz questions (options only, NOT leaking correct answers to client)
  const questions = await getQuizQuestions(quizId)

  if (!questions || questions.length === 0) {
    notFound()
  }

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto">
      <QuizRunner quiz={quiz} questions={questions} />
    </div>
  )
}
