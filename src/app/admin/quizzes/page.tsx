import { createAdminClient } from '@/lib/supabase/admin'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { HelpCircle, Clock, Award, Plus, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default async function AdminQuizzesPage() {
  const supabase = createAdminClient()

  const { data: quizzes } = await supabase
    .from('quizzes')
    .select('*, quiz_questions(count), quiz_attempts(count)')
    .order('created_at', { ascending: true })

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <HelpCircle className="h-6 w-6 text-purple-400" /> Quiz Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure passing criteria, time limits, question pools, and view aggregate attempts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizzes?.map((quiz) => (
          <Card key={quiz.id} className="bg-slate-950 border-slate-800 shadow-sm flex flex-col justify-between">
            <CardHeader className="space-y-2 pb-3">
              <div className="flex items-center justify-between">
                <Badge
                  className={
                    quiz.is_published
                      ? 'bg-emerald-600 text-white text-[10px]'
                      : 'bg-slate-800 text-slate-400 text-[10px]'
                  }
                >
                  {quiz.is_published ? 'Published' : 'Draft'}
                </Badge>
                <span className="text-[11px] text-purple-400 font-semibold">
                  Pass Threshold: {quiz.passing_score}%
                </span>
              </div>

              <CardTitle className="text-base font-bold text-white">
                {quiz.title}
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 leading-relaxed">
                {quiz.description || 'Module knowledge check and certification hurdle.'}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-purple-400" /> {quiz.time_limit_minutes || 30} mins
                </span>
                <span>Max Attempts: {quiz.max_attempts}</span>
              </div>

              <Link href={`/quizzes/${quiz.id}`} target="_blank">
                <Button size="sm" variant="outline" className="h-7 text-xs border-slate-700 text-slate-300 hover:bg-slate-800">
                  Preview Quiz
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

