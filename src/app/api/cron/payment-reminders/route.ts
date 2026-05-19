import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const today = new Date()
    const in3days = new Date(today)
    in3days.setDate(today.getDate() + 3)

    const duePays = await db.payment.findMany({
      where: {
        nextDueDate: { lte: in3days },
        status: 'PAID',
        member: { active: true },
      },
      include: { member: true },
    })

    let created = 0
    for (const pay of duePays) {
      if (!pay.memberId) continue
      const dayStart = new Date(today)
      dayStart.setHours(0, 0, 0, 0)
      const existingNotif = await db.notification.findFirst({
        where: {
          memberId: pay.memberId,
          type: 'PAYMENT_REMINDER',
          status: 'PENDING',
          createdAt: { gte: dayStart },
        },
      })
      if (!existingNotif) {
        const dueStr = pay.nextDueDate?.toLocaleDateString('es-AR') || 'pronto'
        const daysLeft = pay.nextDueDate
          ? Math.ceil((pay.nextDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          : 0
        const urgency = daysLeft <= 0 ? 'VENCIDO' : `vence en ${daysLeft} dia(s)`
        await db.notification.create({
          data: {
            memberId: pay.memberId,
            type: 'PAYMENT_REMINDER',
            channel: 'IN_APP',
            title: `Pago ${urgency}`,
            message: `El pago de ${pay.member.name} ${urgency === 'VENCIDO' ? 'vencio el' : 'vence el'} ${dueStr}. Recordar cobrar cuota.`,
            scheduledAt: today,
            dueDate: pay.nextDueDate,
            status: 'PENDING',
          },
        })
        created++
      }
    }
    return NextResponse.json({ processed: duePays.length, created })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
