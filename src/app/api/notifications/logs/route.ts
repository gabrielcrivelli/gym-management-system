import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const logs = await db.notificationLog.findMany({
      orderBy: { sentAt: 'desc' },
      take: 100,
    })
    return NextResponse.json(logs)
  } catch {
    return NextResponse.json({ error: 'Error fetching logs' }, { status: 500 })
  }
}
