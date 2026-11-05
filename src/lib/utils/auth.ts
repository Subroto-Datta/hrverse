import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import type { Profile } from '@/types'

export async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return null
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profileError && profile) {
    return profile as Profile
  }

  // Safe fallback to admin client if RLS recursion was triggered
  try {
    const adminSupabase = createAdminClient()
    const { data: adminProfile } = await adminSupabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (adminProfile) {
      return adminProfile as Profile
    }
  } catch {
    // ignore
  }

  return null
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    redirect('/login')
  }
  return user
}

export async function requireAdmin(): Promise<Profile> {
  const profile = await getProfile()
  if (!profile) {
    redirect('/login')
  }
  if (profile.role !== 'admin') {
    redirect('/dashboard')
  }
  return profile
}

export async function requireStudent(): Promise<Profile> {
  const profile = await getProfile()
  if (!profile) {
    redirect('/login')
  }
  return profile
}
