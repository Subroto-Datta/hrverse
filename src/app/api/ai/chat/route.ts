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
    const { message, lessonTitle, lessonContent, conversationHistory } = body

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const systemPrompt = `You are HR Verse Mentor, an elite, highly knowledgeable AI Learning Assistant embedded in HR Verse — an AI-powered Human Resource Management LMS.
Your mission is to help students deeply comprehend strategic and operational HRM concepts, prepare for certifications (like CHRMP, SHRM-CP, PHR), and solve complex workplace dilemmas.

Pedagogical Principles:
1. Ground your answers in established HR frameworks (SHRM, WorldatWork, Kirkpatrick, ADDIE, BARS, OKRs, Knowles' Andragogy).
2. Provide clear, concrete real-world business examples or mini-scenarios.
3. If discussing compensation, always mention internal equity vs. external competitiveness and formulas (compa-ratio = actual/midpoint).
4. If discussing selection, emphasize predictive validity (Schmidt & Hunter), structured interviews (STAR), and legal non-discrimination (4/5ths rule).
5. Maintain an encouraging, intellectual, and professional executive tone.
${lessonTitle ? `\nCurrent Lesson Context: "${lessonTitle}"\nLesson Content Excerpt: ${typeof lessonContent === 'string' ? lessonContent.slice(0, 1000) : ''}` : ''}`

    const userPrompt = `${conversationHistory ? `Previous Chat:\n${JSON.stringify(conversationHistory.slice(-4))}\n\n` : ''}Student Query: ${message}`

    const aiReply = await generateAIResponse(systemPrompt, userPrompt)

    // Save to learning activities asynchronously
    await supabase.from('learning_activities').insert({
      student_id: user.id,
      activity_type: 'ai_chat',
      resource_id: user.id,
      resource_type: 'ai_assistant',
      metadata: { messageQuery: message.slice(0, 100) },
    })

    return NextResponse.json({ reply: aiReply })
  } catch (error: unknown) {
    const err = error as Error
    console.error('AI chat endpoint error:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to generate AI response' },
      { status: 500 }
    )
  }
}

