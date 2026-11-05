import { Resend } from 'resend'

let resendClient: Resend | null = null

export function getResendClient(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY)
  }
  return resendClient
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  const resend = getResendClient()

  const { data, error } = await resend.emails.send({
    from: 'HR Verse <noreply@hrverse.com>',
    to,
    subject,
    html,
  })

  if (error) {
    console.error('Email send error:', error)
    throw new Error(`Failed to send email: ${error.message}`)
  }

  return data
}
