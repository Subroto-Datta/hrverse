import { createAdminClient } from '@/lib/supabase/admin'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Layers, Plus, FileText, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function AdminModulesPage() {
  const supabase = createAdminClient()

  // Fetch modules with parts and lessons
  const { data: modules } = await supabase
    .from('modules')
    .select('*, parts(*, lessons(*))')
    .order('order_index', { ascending: true })

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <Layers className="h-6 w-6 text-amber-400" /> Module & Part Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Organize course hierarchy: Courses → Modules → Parts → Lessons.
          </p>
        </div>

        <Link href="/admin/lessons">
          <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white gap-1.5 text-xs">
            <FileText className="h-4 w-4" /> Lesson Editor
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        {modules?.map((mod) => (
          <Card key={mod.id} className="bg-slate-950 border-slate-800 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-900/60 border-b border-slate-800/80 pb-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-amber-500 text-white text-[10px]">
                  Module {mod.order_index}
                </Badge>
                <span className="text-[11px] text-slate-400">
                  {mod.parts?.length || 0} Parts
                </span>
              </div>
              <CardTitle className="text-base font-bold text-white mt-1">
                {mod.title}
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                {mod.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              {mod.parts?.map((part: { id: string; title: string; order_index: number; lessons: Array<{ id: string; title: string; estimated_minutes: number; is_published: boolean }> }) => (
                <div key={part.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-amber-300">
                      Part {part.order_index}: {part.title}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {part.lessons?.length || 0} Lessons
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {part.lessons?.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800/60 text-xs"
                      >
                        <span className="truncate text-slate-200 font-medium">{lesson.title}</span>
                        <Link href={`/admin/lessons/${lesson.id}/edit`}>
                          <Button size="sm" variant="ghost" className="h-6 text-[10px] text-amber-400 hover:text-white hover:bg-slate-800">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

