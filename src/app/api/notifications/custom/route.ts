import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/notifications/email-service'
import { sendWhatsApp } from '@/lib/notifications/whatsapp-service'

export async function POST(req: Request) {
  try {
    const { recipient, channel, subject, message } = await req.json()
    if (channel === 'email') {
      await sendEmail({ to: recipient, subject, text: message })
    } else if (channel === 'whatsapp') {
      await sendWhatsApp({ to: recipient, message })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error sending notification' }, { status: 500 })
  }
}
