'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { submitQuizAttempt } from '@/actions/learning'
import {
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Loader2,
  Award,
} from 'lucide-react'
import Link from 'next/link'

interface QuestionOption {
  id: string
  text: string
  is_correct?: boolean
}

interface Question {
  id: string
  question_text: string
  options: QuestionOption[]
  points: number
  explanation?: string | null
}

export function QuizRunner({
  quiz,
  questions,
}: {
  quiz: {
    id: string
    title: string
    description: string | null
    passing_score: number
    time_limit_minutes: number | null
  }
  questions: Question[]
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState<number>(
    (quiz.time_limit_minutes || 30) * 60
  )
  const [result, setResult] = useState<{
    score: number
    totalPoints: number
    percentage: number
    passed: boolean
  } | null>(null)

  // Timer countdown
  useEffect(() => {
    if (result) return
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [result])

  const currentQ = questions[currentIndex]
  const currentAnswer = answers[currentQ?.id] || ''

  const handleSelectOption = (optionId: string) => {
    setAnswers({
      ...answers,
      [currentQ.id]: optionId,
    })
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const timeSpent = (quiz.time_limit_minutes || 30) * 60 - secondsLeft
      const res = await submitQuizAttempt(quiz.id, answers, Math.max(timeSpent, 10))
      setResult(res)
    } catch (err) {
      console.error('Quiz submission error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  // Results Screen
  if (result) {
    return (
      <Card className="border border-border/80 shadow-md max-w-2xl mx-auto">
        <CardContent className="p-8 text-center space-y-6">
          <div
            className={`h-16 w-16 rounded-full flex items-center justify-center mx-auto ${
              result.passed
                ? 'bg-emerald-500/10 text-emerald-600'
                : 'bg-red-500/10 text-red-600'
            }`}
          >
            {result.passed ? (
              <CheckCircle2 className="h-8 w-8" />
            ) : (
              <XCircle className="h-8 w-8" />
            )}
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              {result.passed ? 'Quiz Passed! Congratulations!' : 'Quiz Not Passed'}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {result.passed
                ? `You met the passing threshold of ${quiz.passing_score}%. Excellent work!`
                : `You scored ${result.percentage}%. The passing threshold is ${quiz.passing_score}%. Review the lessons and try again.`}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-muted/30 border border-border/60 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Your Score</p>
              <p className="text-xl font-bold text-foreground">
                {result.score} / {result.totalPoints}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Percentage</p>
              <p className="text-xl font-bold text-foreground">
                {Math.round(result.percentage)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <p
                className={`text-xl font-bold ${
                  result.passed ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {result.passed ? 'Passed' : 'Failed'}
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setResult(null)
                setAnswers({})
                setCurrentIndex(0)
                setSecondsLeft((quiz.time_limit_minutes || 30) * 60)
              }}
              className="gap-2 text-xs"
            >
              <RotateCcw className="h-4 w-4" /> Retake Quiz
            </Button>
            <Link href="/quizzes">
              <Button size="sm" className="gap-2 text-xs">
                Back to All Quizzes
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!currentQ) {
    return <div className="p-8 text-center text-muted-foreground">No questions found in this quiz.</div>
  }

  const answeredCount = Object.keys(answers).length
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100)

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top Header & Progress */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">{quiz.title}</h2>
          <p className="text-xs text-muted-foreground">
            Question {currentIndex + 1} of {questions.length} • {answeredCount} answered
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-muted border border-border">
          <Clock className="h-3.5 w-3.5 text-primary" />
          <span>{formatTime(secondsLeft)}</span>
        </div>
      </div>

      <Progress value={progressPercent} className="h-1.5" />

      {/* Question Card */}
      <Card className="border border-border/80 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base sm:text-lg font-semibold leading-relaxed">
            {currentIndex + 1}. {currentQ.question_text}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={currentAnswer} onValueChange={handleSelectOption} className="space-y-3">
            {currentQ.options?.map((opt) => (
              <div
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`flex items-center space-x-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  currentAnswer === opt.id
                    ? 'border-primary bg-primary/5 text-foreground shadow-sm'
                    : 'border-border/70 hover:bg-muted/30 text-muted-foreground'
                }`}
              >
                <RadioGroupItem value={opt.id} id={opt.id} />
                <Label htmlFor={opt.id} className="text-xs sm:text-sm font-normal cursor-pointer flex-1 leading-relaxed">
                  <span className="font-semibold text-foreground mr-1.5">{opt.id})</span> {opt.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="gap-1.5 text-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Previous
        </Button>

        {currentIndex === questions.length - 1 ? (
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={submitting}
            className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {submitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                <Award className="h-3.5 w-3.5" /> Submit Quiz
              </>
            )}
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
            className="gap-1.5 text-xs"
          >
            Next <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  )
}
