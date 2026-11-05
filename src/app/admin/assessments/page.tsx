import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ClipboardCheck, FolderKanban, Plus, Eye } from 'lucide-react'
import Link from 'next/link'

export default async function AdminAssessmentsPage() {
  const supabase = await createClient()

  const { data: assessments } = await supabase
    .from('assessments')
    .select('*, assessment_submissions(count)')
    .order('created_at', { ascending: true })

  const { data: projects } = await supabase
    .from('projects')
    .select('*, project_submissions(count)')
    .order('created_at', { ascending: true })

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <ClipboardCheck className="h-6 w-6 text-purple-400" /> Assessment & Project Architecture
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage written scenario prompts, scoring rubrics, and capstone milestones.
          </p>
        </div>
      </div>

      {/* Written Assessments */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ClipboardCheck className="h-4 w-4 text-purple-400" /> Case Study Written Assessments
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assessments?.map((item) => (
            <Card key={item.id} className="bg-slate-950 border-slate-800 shadow-sm flex flex-col justify-between">
              <CardHeader className="space-y-1.5 pb-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-purple-600 text-white text-[10px]">
                    {item.max_score} Max Points
                  </Badge>
                  <span className="text-[11px] text-slate-400">
                    {item.assessment_submissions?.[0]?.count || 0} Submissions
                  </span>
                </div>
                <CardTitle className="text-base font-bold text-white">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  {item.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Rubric Criteria: {Array.isArray(item.rubric) ? item.rubric.length : 4}</span>
                <Link href={`/assessments/${item.id}`} target="_blank">
                  <Button size="sm" variant="ghost" className="h-7 text-xs text-purple-400 hover:text-white">
                    <Eye className="h-3.5 w-3.5 mr-1" /> View Brief
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Capstone Projects */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <FolderKanban className="h-4 w-4 text-purple-400" /> Capstone Portfolios
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects?.map((item) => (
            <Card key={item.id} className="bg-slate-950 border-slate-800 shadow-sm flex flex-col justify-between">
              <CardHeader className="space-y-1.5 pb-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-purple-600 text-white text-[10px]">
                    {item.max_score} Max Points
                  </Badge>
                  <span className="text-[11px] text-slate-400">
                    {item.project_submissions?.[0]?.count || 0} Portfolios
                  </span>
                </div>
                <CardTitle className="text-base font-bold text-white">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  {item.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Rubric Criteria: {Array.isArray(item.rubric) ? item.rubric.length : 5}</span>
                <Link href={`/projects/${item.id}`} target="_blank">
                  <Button size="sm" variant="ghost" className="h-7 text-xs text-purple-400 hover:text-white">
                    <Eye className="h-3.5 w-3.5 mr-1" /> View Capstone
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

