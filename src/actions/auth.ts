'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export interface AuthActionResult {
  error?: string
  success?: boolean
  message?: string
}

export async function login(prevState: AuthActionResult | null, formData: FormData): Promise<AuthActionResult> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Please enter both email and password.' }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Fetch user profile to direct to appropriate experience
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  revalidatePath('/', 'layout')

  if (profile?.role === 'admin') {
    redirect('/admin')
  }

  redirect('/dashboard')
}

export async function signup(prevState: AuthActionResult | null, formData: FormData): Promise<AuthActionResult> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  if (!email || !password || !fullName) {
    return { error: 'Please provide full name, email, and password.' }
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters.' }
  }

  const supabase = await createClient()

  // Sign up the user. Note: Admin privileges CANNOT be acquired here as per requirement
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function forgotPassword(prevState: AuthActionResult | null, formData: FormData): Promise<AuthActionResult> {
  const email = formData.get('email') as string

  if (!email) {
    return { error: 'Please enter your registered email address.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login?reset=success`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, message: 'Password reset link sent to your email.' }
}

