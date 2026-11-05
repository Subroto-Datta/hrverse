'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { forgotPassword, type AuthActionResult } from '@/actions/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState<AuthActionResult | null, FormData>(forgotPassword, null)

  return (
    <Card className="border border-border/80 shadow-lg bg-card">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">Reset Password</CardTitle>
        <CardDescription className="text-xs">
          Enter your email to receive password recovery instructions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state?.success ? (
          <div className="space-y-4 text-center py-4">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="text-sm text-foreground font-medium">Check your inbox</p>
            <p className="text-xs text-muted-foreground">{state.message}</p>
            <div className="pt-2">
              <Link href="/login">
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" /> Return to Login
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <Alert variant="destructive" className="py-2 text-xs">
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                required
                autoComplete="email"
              />
            </div>

            <Button type="submit" className="w-full gap-2 mt-2" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending Link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
