import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url)
    const monthParam = searchParams.get('month') // format: 2026-05

    let startDate: Date
    let endDate: Date

    if (monthParam) {
      const [year, month] = monthParam.split('-').map(Number)
      startDate = new Date(year, month - 1, 1)
      endDate = new Date(year, month, 1)
    } else {
      const now = new Date()
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    }

    const records = await db.attendance.findMany({
      where: {
        memberId: params.id,
        checkIn: { gte: startDate, lt: endDate },
      },
      orderBy: { checkIn: 'asc' },
    })

    return NextResponse.json({ data: records })
  } catch {
    return NextResponse.json({ error: 'Error fetching attendance' }, { status: 500 })
  }
}
