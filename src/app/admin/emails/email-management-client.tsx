'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Mail, Send, CheckCircle2, Clock, Loader2, AlertCircle } from 'lucide-react'

export function EmailManagementClient({
  students,
}: {
  students: Array<{ id: string; full_name: string; email: string }>
}) {
  const [recipient, setRecipient] = useState<string>('all')
  const [template, setTemplate] = useState<'assessment' | 'quiz' | 'inactivity' | 'welcome'>('assessment')
  const [subject, setSubject] = useState('Reminder: Strategic HR Assessment Due in 48 Hours')
  const [body, setBody] = useState(
    `Dear Student,\n\nThis is a friendly reminder that Assessment 1: Strategic HR Roadmap for ApexLogix Technologies is due in 48 hours.\n\nPlease ensure your deliverable covers all four strategic pillars (Talent Acquisition, Total Rewards, Performance Management, Culture).\n\nBest regards,\nHR Verse Academic Team`
  )
  const [sending, setSending] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const handleTemplateChange = (val: 'assessment' | 'quiz' | 'inactivity' | 'welcome') => {
    setTemplate(val)
    if (val === 'assessment') {
      setSubject('Reminder: Strategic HR Assessment Due in 48 Hours')
      setBody(
        `Dear Student,\n\nThis is a friendly reminder that Assessment 1: Strategic HR Roadmap for ApexLogix Technologies is due in 48 hours.\n\nPlease ensure your deliverable covers all four strategic pillars.\n\nBest regards,\nHR Verse Academic Team`
      )
    } else if (val === 'quiz') {
      setSubject('Action Required: Complete Week 1 Comprehensive Quiz')
      setBody(
        `Dear Student,\n\nYou have completed the reading for Week 1 modules. Please log in to your dashboard to complete the Week 1 Comprehensive Quiz (20 questions, 70% passing threshold).\n\nBest regards,\nHR Verse Team`
      )
    } else if (val === 'inactivity') {
      setSubject('We Miss You on HR Verse! Continue Your CHRMP Journey')
      setBody(
        `Dear Student,\n\nIt has been over 7 days since your last lesson. Keep your momentum going toward your Certified Human Resource Management Professional (CHRMP) credential!\n\nBest regards,\nHR Verse Team`
      )
    } else if (val === 'welcome') {
      setSubject('Welcome to HR Verse: Your CHRMP Journey Begins Today')
      setBody(
        `Welcome to HR Verse!\n\nYou are enrolled in the 8-Week Certified Human Resource Management Professional program. Your first step is to explore the Course Roadmap and begin Module 1 in the Learning Workspace.\n\nBest regards,\nHR Verse Team`
      )
    }
  }

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setStatusMessage(null)

    try {
      const res = await fetch('/api/admin/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient,
          subject,
          body,
          template,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setStatusMessage('Email reminders dispatched via Resend!')
      } else {
        setStatusMessage(`Notice: ${data.message || data.error || 'Check Resend API credentials.'}`)
      }
    } catch (err: unknown) {
      const error = err as Error
      setStatusMessage(`Notice: ${error.message}`)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-950 border-slate-800 shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-400" /> Automated Email Campaign Dispatcher
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Powered by Resend API. Deliver personalized notifications, due date alerts, and re-engagement triggers.
              </CardDescription>
            </div>
            <Badge className="bg-amber-500 text-white text-[10px]">Resend Integration</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSendEmail} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Recipient Audience</Label>
                <select
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full text-xs bg-slate-900 border border-slate-700 text-white p-2.5 rounded-md"
                >
                  <option value="all">All Enrolled Students ({students.length})</option>
                  <option value="lagging">Students Falling Behind (&lt; 25% progress)</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.email}>
                      Individual: {s.full_name || s.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Campaign Template</Label>
                <select
                  value={template}
                  onChange={(e) => handleTemplateChange(e.target.value as unknown as typeof template)}
                  className="w-full text-xs bg-slate-900 border border-slate-700 text-white p-2.5 rounded-md"
                >
                  <option value="assessment">Assessment Due Reminder</option>
                  <option value="quiz">Pending Quiz Reminder</option>
                  <option value="inactivity">Inactivity Re-Engagement</option>
                  <option value="welcome">Welcome Onboarding Email</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-300">Email Subject Line</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="text-xs bg-slate-900 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-300">Email Body (Plain Text / HTML)</Label>
              <Textarea
                rows={6}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="text-xs bg-slate-900 border-slate-700 text-slate-200 leading-relaxed font-sans"
              />
            </div>

            {statusMessage && (
              <div className="p-3 rounded-lg bg-slate-900 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={sending}
              className="text-xs bg-amber-500 hover:bg-amber-600 text-white gap-2 shadow-sm"
            >
              {sending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Dispatching Emails...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" /> Dispatch Campaign via Resend
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

