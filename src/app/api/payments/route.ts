import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const payments = await db.payment.findMany({
      include: { member: true, membership: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(payments)
  } catch {
    return NextResponse.json({ error: 'Error fetching payments' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const payment = await db.payment.create({ data: body })
    return NextResponse.json(payment, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error creating payment' }, { status: 500 })
  }
}
