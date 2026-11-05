'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { login, type AuthActionResult } from '@/actions/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<AuthActionResult | null, FormData>(login, null)

  return (
    <Card className="border border-border/80 shadow-lg bg-card">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">Sign In to HR Verse</CardTitle>
        <CardDescription className="text-xs">
          Enter your email and password to access your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" className="w-full gap-2 mt-2" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                Sign In <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>

          <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border/60">
            Don&apos;t have an account yet?{' '}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

