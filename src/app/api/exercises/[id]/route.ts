import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const exercise = await db.exercise.findUnique({
      where: { id: params.id },
      include: { equipment: true },
    })
    if (!exercise) return NextResponse.json({ error: 'Exercise not found' }, { status: 404 })
    return NextResponse.json(exercise)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching exercise' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const exercise = await db.exercise.update({ where: { id: params.id }, data: body })
    return NextResponse.json(exercise)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await db.exercise.delete({ where: { id: params.id } })
    return NextResponse.json({ message: 'Exercise deleted' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
