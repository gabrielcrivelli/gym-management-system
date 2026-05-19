import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const settings = await db.config.findMany({
      where: { key: { startsWith: 'notification_' } },
    })
    return NextResponse.json(Object.fromEntries(settings.map(s => [s.key, s.value])))
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    await Promise.all(
      Object.entries(body).map(([key, value]) =>
        db.config.upsert({
          where: { key },
          update: { value: value as string },
          create: { key, value: value as string },
        })
      )
    )
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error saving settings' }, { status: 500 })
  }
}
