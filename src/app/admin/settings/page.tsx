import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Settings, ShieldCheck, Database, BrainCircuit, Mail, HardDrive } from 'lucide-react'

export default function AdminSettingsPage() {
  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-slate-800 pb-6 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <Settings className="h-6 w-6 text-amber-400" /> Platform Settings & Infrastructure
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Manage system configurations, AI models, database connections, and email integrations.
        </p>
      </div>

      <div className="space-y-6">
        {/* Core LMS Configurations */}
        <Card className="bg-slate-950 border-slate-800 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-800">
            <CardTitle className="text-base font-bold text-white">LMS Academic Policies</CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Default passing scores, attempt limits, and certification rules
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Default Quiz Passing Score (%)</Label>
                <Input defaultValue={70} type="number" className="text-xs bg-slate-900 border-slate-700 text-white" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Max Quiz Retake Attempts</Label>
                <Input defaultValue={3} type="number" className="text-xs bg-slate-900 border-slate-700 text-white" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Curriculum Duration (Weeks)</Label>
                <Input defaultValue={8} type="number" className="text-xs bg-slate-900 border-slate-700 text-white" />
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-t border-slate-800/80">
              <div>
                <p className="text-xs font-semibold text-white">Enforce Sequential Progression</p>
                <p className="text-[11px] text-slate-400">
                  Require students to pass each week&apos;s quiz before unlocking the subsequent module.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Third-Party Integrations Status */}
        <Card className="bg-slate-950 border-slate-800 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-800">
            <CardTitle className="text-base font-bold text-white">Connected Infrastructure & APIs</CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Operational status of external services powering HR Verse
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-emerald-400" />
                <div>
                  <p className="text-xs font-bold text-white">Supabase PostgreSQL & SSR Auth</p>
                  <p className="text-[10px] text-slate-400">RLS Policies Active • User Roles Boundary</p>
                </div>
              </div>
              <Badge className="bg-emerald-600 text-white text-[10px]">Connected</Badge>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-3">
                <BrainCircuit className="h-5 w-5 text-amber-400" />
                <div>
                  <p className="text-xs font-bold text-white">Groq AI Cloud SDK</p>
                  <p className="text-[10px] text-slate-400">Model: llama-3.3-70b-versatile • Pedagogical Mentorship</p>
                </div>
              </div>
              <Badge className="bg-amber-500 text-white text-[10px]">Active</Badge>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-indigo-400" />
                <div>
                  <p className="text-xs font-bold text-white">Resend Email Transactional Engine</p>
                  <p className="text-[10px] text-slate-400">Automated Reminders & Due Date Alerts</p>
                </div>
              </div>
              <Badge className="bg-indigo-600 text-white text-[10px]">Active</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

