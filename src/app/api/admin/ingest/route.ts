import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ingestReferenceContent } from '@/lib/content/ingest'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Role verification
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    const result = await ingestReferenceContent()
    return NextResponse.json(result)
  } catch (error: unknown) {
    const err = error as Error
    console.error('Ingestion error:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to ingest reference content' },
      { status: 500 }
    )
  }
}
