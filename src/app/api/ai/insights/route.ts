import { NextRequest, NextResponse } from 'next/server'
import { generateAIResponse } from '@/lib/groq/client'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { studentId, metrics } = body

    // Security check: only admins can request insights for other students; students can only request for themselves
    if (studentId && studentId !== user.id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const systemPrompt = `You are the HR Verse Learning Analytics AI. You analyze LMS student performance data and output concise, diagnostic performance insights.
Format your output in clean Markdown with:
1. Executive Summary (1-2 sentences on student trajectory)
2. Strengths Identified (2 bullet points)
3. Knowledge Deficits & Risk Areas (2 bullet points with targeted module references)
4. Recommended Remedial Interventions (2 actionable steps: review specific lessons, retake quiz, or 1-on-1 coaching)`

    const userPrompt = `Student Performance Metrics:
${JSON.stringify(metrics, null, 2)}`

    const insight = await generateAIResponse(systemPrompt, userPrompt)

    return NextResponse.json({ insight })
  } catch (error: unknown) {
    const err = error as Error
    console.error('AI insights error:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to generate AI insights' },
      { status: 500 }
    )
  }
}

