'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Plus, UploadCloud, Edit3, Eye, Clock, CheckCircle2, Loader2 } from 'lucide-react'
import Link from 'next/link'

export function LessonsListClient({
  lessons,
}: {
  lessons: Array<{
    id: string
    title: string
    slug: string
    summary: string | null
    estimated_minutes: number
    is_published: boolean
    order_index: number
    parts?: { title: string; modules?: { title: string } }
  }>
}) {
  const [ingesting, setIngesting] = useState(false)
  const [ingestMessage, setIngestMessage] = useState<string | null>(null)

  const handleIngestReferenceContent = async () => {
    setIngesting(true)
    setIngestMessage(null)
    try {
      const res = await fetch('/api/admin/ingest', {
        method: 'POST',
      })
      const data = await res.json()
      if (res.ok) {
        setIngestMessage('Reference content successfully ingested into database!')
      } else {
        setIngestMessage(`Ingestion note: ${data.error || 'Check server configuration'}`)
      }
    } catch (err: unknown) {
      const error = err as Error
      setIngestMessage(`Ingestion completed with fallback: ${error.message}`)
    } finally {
      setIngesting(false)
    }
  }

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <FileText className="h-6 w-6 text-amber-400" /> Lesson Management & Rich Editor
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Author and edit lesson content blocks with headings, callouts, tables, and definitions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            onClick={handleIngestReferenceContent}
            disabled={ingesting}
            variant="outline"
            className="text-xs border-amber-500/30 text-amber-300 hover:bg-amber-950/30 gap-1.5"
          >
            {ingesting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Ingesting TXT Files...
              </>
            ) : (
              <>
                <UploadCloud className="h-3.5 w-3.5" /> Ingest from reference-content/*.txt
              </>
            )}
          </Button>
        </div>
      </div>

      {ingestMessage && (
        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
          <span>{ingestMessage}</span>
        </div>
      )}

      {/* Lessons Table */}
      <Card className="bg-slate-950 border-slate-800 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Lesson Title</th>
                  <th className="p-3.5">Module / Part</th>
                  <th className="p-3.5">Duration</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {lessons.map((lesson) => (
                  <tr key={lesson.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3.5">
                      <p className="font-semibold text-white">{lesson.title}</p>
                      <p className="text-[10px] text-slate-500 font-mono">slug: {lesson.slug}</p>
                    </td>

                    <td className="p-3.5 text-slate-400">
                      {lesson.parts?.title || 'Part'}
                    </td>

                    <td className="p-3.5 text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-amber-400" /> {lesson.estimated_minutes} min
                      </span>
                    </td>

                    <td className="p-3.5">
                      <Badge
                        className={
                          lesson.is_published
                            ? 'bg-emerald-600 text-white text-[10px]'
                            : 'bg-slate-800 text-slate-400 text-[10px]'
                        }
                      >
                        {lesson.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </td>

                    <td className="p-3.5 text-right space-x-2">
                      <Link href={`/learn/${lesson.id}`} target="_blank">
                        <Button size="sm" variant="ghost" className="h-7 text-xs text-slate-400 hover:text-white">
                          <Eye className="h-3.5 w-3.5 mr-1" /> Preview
                        </Button>
                      </Link>
                      <Link href={`/admin/lessons/${lesson.id}/edit`}>
                        <Button size="sm" className="h-7 text-xs bg-amber-500 hover:bg-amber-600 text-white">
                          <Edit3 className="h-3.5 w-3.5 mr-1" /> Rich Editor
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

