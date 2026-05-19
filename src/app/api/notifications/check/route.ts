import { NextResponse } from 'next/server'
import { checkAndSendNotifications } from '@/lib/notifications/notification-scheduler'

export async function POST() {
  try {
    await checkAndSendNotifications()
    return NextResponse.json({ success: true, message: 'Notifications checked' })
  } catch (error) {
    return NextResponse.json({ error: 'Error checking notifications' }, { status: 500 })
  }
}
