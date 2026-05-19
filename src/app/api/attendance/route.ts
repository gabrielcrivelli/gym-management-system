import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const records = await db.attendance.findMany({
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
    const record = await db.attendance.create({ data: { memberId } })
    return NextResponse.json(record, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error creating attendance' }, { status: 500 })
  }
}
