import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const dateParam = searchParams.get('date')

    const where: Record<string, unknown> = {}
    if (dateParam) {
      const date = new Date(dateParam)
      date.setHours(0, 0, 0, 0)
      const nextDay = new Date(date)
      nextDay.setDate(nextDay.getDate() + 1)
      where.checkIn = { gte: date, lt: nextDay }
    }

    const records = await db.attendance.findMany({
      where,
      orderBy: { checkIn: 'desc' },
      include: { member: true },
    })
    return NextResponse.json(records)
  } catch {
    return NextResponse.json({ error: 'Error fetching attendance' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { memberId } = await req.json()
    if (!memberId) {
      return NextResponse.json({ error: 'memberId es requerido' }, { status: 400 })
    }

    // Prevenir duplicados: verificar entrada activa sin salida del dia
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const existing = await db.attendance.findFirst({
      where: {
        memberId,
        checkIn: { gte: today, lt: tomorrow },
        checkOut: null,
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'El miembro ya tiene una entrada activa hoy. Registre la salida antes de una nueva entrada.' },
        { status: 409 }
      )
    }

    const record = await db.attendance.create({
      data: { memberId, checkIn: new Date() },
      include: { member: true },
    })
    return NextResponse.json(record, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error creating attendance'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
