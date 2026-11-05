import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GraduationCap, Plus, CheckCircle2, Clock, Globe } from 'lucide-react'
import Link from 'next/link'
import { toggleCoursePublish } from '@/actions/admin'

export default async function AdminCoursesPage() {
  const supabase = await createClient()

  const { data: courses } = await supabase
    .from('courses')
    .select('*, modules(*)')
    .order('created_at', { ascending: true })

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <GraduationCap className="h-6 w-6 text-purple-400" /> Course Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Create, configure duration, set difficulty levels, and manage publication states.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses?.map((course) => (
          <Card key={course.id} className="bg-slate-950 border-slate-800 shadow-sm flex flex-col justify-between">
            <CardHeader className="space-y-2 pb-3">
              <div className="flex items-center justify-between">
                <Badge
                  className={
                    course.is_published
                      ? 'bg-emerald-600 text-white text-[10px]'
                      : 'bg-slate-800 text-slate-400 text-[10px]'
                  }
                >
                  {course.is_published ? 'Published & Active' : 'Draft Mode'}
                </Badge>
                <span className="text-[11px] text-slate-400 capitalize">
                  {course.difficulty_level}
                </span>
              </div>

              <CardTitle className="text-lg font-bold text-white">
                {course.title}
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 leading-relaxed">
                {course.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-purple-400" /> {course.duration_weeks} Weeks
                </span>
                <span>{course.modules?.length || 0} Modules</span>
              </div>

              <div className="flex items-center gap-2">
                <form
                  action={async () => {
                    'use server'
                    await toggleCoursePublish(course.id, !course.is_published)
                  }}
                >
                  <Button
                    type="submit"
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    {course.is_published ? 'Unpublish' : 'Publish'}
                  </Button>
                </form>

                <Link href={`/admin/modules`}>
                  <Button size="sm" className="h-8 text-xs bg-purple-600 hover:bg-purple-700 text-white">
                    Manage Modules
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
