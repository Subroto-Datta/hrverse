import { getProfile } from '@/lib/utils/auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'

export default async function SettingsPage() {
  const profile = await getProfile()

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-4xl mx-auto">
      <div className="border-b border-border pb-6 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Manage your personal profile, notifications, and security preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <Card className="border border-border/80 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold">Personal Profile</CardTitle>
              <Badge variant="outline" className="capitalize text-xs">
                {profile?.role || 'student'}
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Your information is displayed on your certification credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-xs">Full Name</Label>
                <Input id="fullName" defaultValue={profile?.full_name || ''} className="text-xs" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs">Email Address</Label>
                <Input id="email" defaultValue={profile?.email || ''} disabled className="text-xs bg-muted" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-xs">Professional Bio / Current Role</Label>
              <Textarea
                id="bio"
                defaultValue={profile?.bio || 'HR Professional & People Operations Enthusiast'}
                rows={3}
                className="text-xs"
              />
            </div>

            <Button size="sm" className="text-xs">
              Save Profile Changes
            </Button>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="border border-border/80 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">Notification & Email Preferences</CardTitle>
            <CardDescription className="text-xs">
              Configure how HR Verse reaches you regarding due dates and milestones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-foreground">Assessment & Quiz Reminders</p>
                <p className="text-[11px] text-muted-foreground">Receive email alerts 48 hours before deadlines via Resend</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-foreground">Grading & Feedback Notifications</p>
                <p className="text-[11px] text-muted-foreground">Instant alerts when an evaluator grades your written submissions</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-foreground">AI Learning Tips & Weekly Digest</p>
                <p className="text-[11px] text-muted-foreground">Curated HR insights and case study recommendations</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
