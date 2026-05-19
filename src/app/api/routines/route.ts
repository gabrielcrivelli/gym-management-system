import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const routines = await db.routine.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' },
        },
        _count: { select: { assignments: true } },
      },
    })
    return NextResponse.json(routines)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching routines' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const routine = await db.routine.create({ data: body })
    return NextResponse.json(routine, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
