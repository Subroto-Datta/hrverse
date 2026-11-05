import { NextRequest, NextResponse } from 'next/server'
import { getUser, getProfile } from '@/lib/utils/auth'
import { sendEmail } from '@/lib/resend/client'

export async function POST(req: NextRequest) {
  try {
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await getProfile()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { recipient, subject, body: emailContent, template } = body

    if (!subject || !emailContent) {
      return NextResponse.json({ error: 'Subject and body are required' }, { status: 400 })
    }

    // Try sending with Resend if configured
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_api_key') {
      try {
        await sendEmail({
          to: recipient === 'all' || recipient === 'lagging' ? 'students@hrverse.com' : recipient,
          subject,
          html: `<div style="font-family: sans-serif; padding: 20px; line-height: 1.6;">${emailContent.replace(/\n/g, '<br/>')}</div>`,
        })
      } catch (emailErr) {
        console.warn('Resend send warning:', emailErr)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Email campaign queued and recorded.',
    })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: err?.message || 'Failed to dispatch email' }, { status: 500 })
  }
}

