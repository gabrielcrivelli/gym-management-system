import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const memberId = searchParams.get('memberId')

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (memberId) where.memberId = memberId

    const notifications = await db.notification.findMany({
      where,
      orderBy: { scheduledAt: 'asc' },
      take: limit,
      include: { member: { select: { id: true, name: true } } },
    })
    return NextResponse.json({ data: notifications })
  } catch {
    return NextResponse.json({ error: 'Error fetching notifications' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { memberId, type, message, title, scheduledAt, dueDate } = body
    if (!memberId || !type || !message) {
      return NextResponse.json({ error: 'memberId, type y message son requeridos' }, { status: 400 })
    }
    const notification = await db.notification.create({
      data: {
        memberId,
        type,
        channel: 'IN_APP',
        message,
        title: title || null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: 'PENDING',
      },
      include: { member: { select: { id: true, name: true } } },
    })
    return NextResponse.json({ data: notification }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error creating notification'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
