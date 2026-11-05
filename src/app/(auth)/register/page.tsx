'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signup, type AuthActionResult } from '@/actions/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, ArrowRight } from 'lucide-react'

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState<AuthActionResult | null, FormData>(signup, null)

  return (
    <Card className="border border-border/80 shadow-lg bg-card">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">Create Your Account</CardTitle>
        <CardDescription className="text-xs">
          Enroll in HR Verse to begin the CHRMP learning certification
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
            <Label htmlFor="fullName" className="text-xs">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="e.g. Jane Doe"
              required
              autoComplete="name"
            />
          </div>

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
            <Label htmlFor="password" className="text-xs">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Minimum 6 characters"
              required
              autoComplete="new-password"
            />
          </div>

          <Button type="submit" className="w-full gap-2 mt-2" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Enroll & Get Started <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>

          <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border/60">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
