import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const routine = await db.routine.findUnique({
      where: { id: params.id },
      include: {
        exercises: {
          include: { exercise: { include: { equipment: true } } },
          orderBy: { order: 'asc' },
        },
        assignments: { include: { member: true }, where: { active: true } },
      },
    })
    if (!routine) return NextResponse.json({ error: 'Routine not found' }, { status: 404 })
    return NextResponse.json(routine)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching routine' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const routine = await db.routine.update({ where: { id: params.id }, data: body })
    return NextResponse.json(routine)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await db.routine.delete({ where: { id: params.id } })
    return NextResponse.json({ message: 'Routine deleted' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
