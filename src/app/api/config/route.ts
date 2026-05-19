import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const configs = await db.config.findMany()
    const map = Object.fromEntries(configs.map(c => [c.key, c.value]))
    return NextResponse.json(map)
  } catch {
    return NextResponse.json({ error: 'Error fetching config' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const updates = await Promise.all(
      Object.entries(body).map(([key, value]) =>
        db.config.upsert({
          where: { key },
          update: { value: value as string },
          create: { key, value: value as string },
        })
      )
    )
    return NextResponse.json(updates)
  } catch {
    return NextResponse.json({ error: 'Error updating config' }, { status: 500 })
  }
}
