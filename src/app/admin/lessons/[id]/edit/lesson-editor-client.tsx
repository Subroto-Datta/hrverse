'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { saveLessonContent } from '@/actions/admin'
import {
  FileText,
  Save,
  Eye,
  Plus,
  Trash2,
  Heading,
  AlignLeft,
  List,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'

interface BlockItem {
  id: string
  type: 'header' | 'paragraph' | 'callout' | 'list' | 'definition' | 'example' | 'table'
  data: Record<string, unknown>
}

export function LessonEditorClient({
  lesson,
}: {
  lesson: {
    id: string
    title: string
    slug: string
    summary: string | null
    estimated_minutes: number
    is_published: boolean
    content: { blocks?: BlockItem[] } | string
  }
}) {
  const [title, setTitle] = useState(lesson.title)
  const [summary, setSummary] = useState(lesson.summary || '')
  const [estimatedMinutes, setEstimatedMinutes] = useState(lesson.estimated_minutes || 20)
  const [isPublished, setIsPublished] = useState(lesson.is_published)

  // Initialize blocks
  const initialBlocks: BlockItem[] = (() => {
    if (typeof lesson.content === 'object' && lesson.content?.blocks) {
      return lesson.content.blocks.map((b, i) => ({ ...b, id: `block-${i}` }))
    }
    if (typeof lesson.content === 'string') {
      try {
        const parsed = JSON.parse(lesson.content)
        if (parsed.blocks) return parsed.blocks.map((b: BlockItem, i: number) => ({ ...b, id: `block-${i}` }))
      } catch {
        return [{ id: 'b0', type: 'paragraph', data: { text: lesson.content } }]
      }
    }
    return [{ id: 'b0', type: 'paragraph', data: { text: 'Initial lesson content...' } }]
  })()

  const [blocks, setBlocks] = useState<BlockItem[]>(initialBlocks)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Block management
  const addBlock = (type: BlockItem['type']) => {
    const newId = `block-${Date.now()}`
    let data: Record<string, unknown> = {}

    if (type === 'header') data = { text: 'Section Heading', level: 2 }
    else if (type === 'paragraph') data = { text: 'Content paragraph text...' }
    else if (type === 'callout') data = { type: 'info', title: 'Key HR Takeaway', text: 'Important concept note...' }
    else if (type === 'list') data = { style: 'unordered', items: ['Point 1', 'Point 2', 'Point 3'] }
    else if (type === 'definition') data = { term: 'Compa-Ratio', definition: 'Actual Salary divided by Salary Grade Midpoint.' }
    else if (type === 'example') data = { text: 'Company XYZ reduced clinical attrition from 34% to 12% using structured STAR interviews.' }

    setBlocks([...blocks, { id: newId, type, data }])
  }

  const updateBlockData = (id: string, key: string, value: unknown) => {
    setBlocks(
      blocks.map((b) => (b.id === id ? { ...b, data: { ...b.data, [key]: value } } : b))
    )
  }

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id))
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveSuccess(false)
    try {
      await saveLessonContent(lesson.id, {
        title,
        summary,
        estimatedMinutes: Number(estimatedMinutes),
        isPublished,
        content: { blocks },
      })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to save lesson:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/lessons">
            <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Lessons
            </Button>
          </Link>
          <span className="text-xs text-slate-500 font-mono">ID: {lesson.id.slice(0, 8)}</span>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/learn/${lesson.id}`} target="_blank">
            <Button size="sm" variant="outline" className="h-8 text-xs border-slate-700 text-slate-300 hover:bg-slate-800">
              <Eye className="h-3.5 w-3.5 mr-1" /> Preview Lesson
            </Button>
          </Link>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="h-8 text-xs bg-amber-500 hover:bg-amber-600 text-white gap-1.5 shadow-sm"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : saveSuccess ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {saving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Lesson Configuration Settings */}
      <Card className="bg-slate-950 border-slate-800 shadow-sm">
        <CardContent className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-xs text-slate-300">Lesson Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xs bg-slate-900 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-300">Estimated Duration (Minutes)</Label>
              <Input
                type="number"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="text-xs bg-slate-900 border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-slate-300">Lesson Summary</Label>
            <Input
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief summary of learning objectives..."
              className="text-xs bg-slate-900 border-slate-700 text-white"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <div>
              <p className="text-xs font-semibold text-white">Publication Status</p>
              <p className="text-[11px] text-slate-400">
                Updating content preserves all existing student progress.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">{isPublished ? 'Published' : 'Draft'}</span>
              <Switch checked={isPublished} onCheckedChange={setIsPublished} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Block Authoring Workspace */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Rich-Text Educational Content Blocks ({blocks.length})
          </h3>

          {/* Quick Insert Toolbar */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={() => addBlock('header')}
              className="text-[11px] h-7 border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              + Heading
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => addBlock('paragraph')}
              className="text-[11px] h-7 border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              + Paragraph
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => addBlock('callout')}
              className="text-[11px] h-7 border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              + Callout
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => addBlock('list')}
              className="text-[11px] h-7 border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              + List
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => addBlock('definition')}
              className="text-[11px] h-7 border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              + Definition
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => addBlock('example')}
              className="text-[11px] h-7 border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              + Example
            </Button>
          </div>
        </div>

        {/* Blocks Flow */}
        <div className="space-y-3">
          {blocks.map((block, index) => (
            <Card key={block.id} className="bg-slate-950 border-slate-800 shadow-sm">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500">#{index + 1}</span>
                    <Badge variant="outline" className="text-[10px] capitalize text-amber-400 border-amber-500/30">
                      {block.type}
                    </Badge>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeBlock(block.id)}
                    className="h-6 w-6 p-0 text-slate-500 hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Header Block Editor */}
                {block.type === 'header' && (
                  <div className="space-y-2">
                    <Input
                      value={(block.data?.text as string) || ''}
                      onChange={(e) => updateBlockData(block.id, 'text', e.target.value)}
                      placeholder="Heading text..."
                      className="text-sm font-bold bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                )}

                {/* Paragraph Block Editor */}
                {block.type === 'paragraph' && (
                  <div className="space-y-2">
                    <Textarea
                      rows={3}
                      value={(block.data?.text as string) || ''}
                      onChange={(e) => updateBlockData(block.id, 'text', e.target.value)}
                      placeholder="Type educational prose..."
                      className="text-xs bg-slate-900 border-slate-700 text-slate-200 leading-relaxed font-sans"
                    />
                  </div>
                )}

                {/* Callout Block Editor */}
                {block.type === 'callout' && (
                  <div className="space-y-2 p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/30">
                    <Input
                      value={(block.data?.title as string) || ''}
                      onChange={(e) => updateBlockData(block.id, 'title', e.target.value)}
                      placeholder="Callout Title..."
                      className="text-xs font-semibold bg-slate-900 border-slate-700 text-indigo-300"
                    />
                    <Textarea
                      rows={2}
                      value={(block.data?.text as string) || ''}
                      onChange={(e) => updateBlockData(block.id, 'text', e.target.value)}
                      placeholder="Callout text..."
                      className="text-xs bg-slate-900 border-slate-700 text-slate-200"
                    />
                  </div>
                )}

                {/* Definition Block Editor */}
                {block.type === 'definition' && (
                  <div className="space-y-2 p-3 rounded-lg bg-amber-950/20 border border-amber-500/30">
                    <Input
                      value={(block.data?.term as string) || ''}
                      onChange={(e) => updateBlockData(block.id, 'term', e.target.value)}
                      placeholder="HR Term (e.g. Compa-Ratio)..."
                      className="text-xs font-semibold bg-slate-900 border-slate-700 text-amber-300"
                    />
                    <Textarea
                      rows={2}
                      value={(block.data?.definition as string) || ''}
                      onChange={(e) => updateBlockData(block.id, 'definition', e.target.value)}
                      placeholder="Technical definition..."
                      className="text-xs bg-slate-900 border-slate-700 text-slate-200"
                    />
                  </div>
                )}

                {/* Example Block Editor */}
                {block.type === 'example' && (
                  <div className="space-y-2 p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
                    <Label className="text-[10px] text-emerald-400 font-semibold">Practical Example</Label>
                    <Textarea
                      rows={2}
                      value={(block.data?.text as string) || ''}
                      onChange={(e) => updateBlockData(block.id, 'text', e.target.value)}
                      placeholder="Scenario example..."
                      className="text-xs bg-slate-900 border-slate-700 text-slate-200"
                    />
                  </div>
                )}

                {/* List Block Editor */}
                {block.type === 'list' && (
                  <div className="space-y-2">
                    <Textarea
                      rows={3}
                      value={((block.data?.items as string[]) || []).join('\n')}
                      onChange={(e) =>
                        updateBlockData(block.id, 'items', e.target.value.split('\n'))
                      }
                      placeholder="One list item per line..."
                      className="text-xs bg-slate-900 border-slate-700 text-slate-200 font-mono"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

