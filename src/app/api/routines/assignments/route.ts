import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { memberId, routineId, startsAt, endsAt, notes } = body

    if (!memberId || !routineId || !startsAt) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    const member = await prisma.member.findUnique({ where: { id: memberId } })
    if (!member) {
      return NextResponse.json({ error: 'Miembro no encontrado' }, { status: 404 })
    }

    const routine = await prisma.routine.findUnique({ where: { id: routineId } })
    if (!routine) {
      return NextResponse.json({ error: 'Rutina no encontrada' }, { status: 404 })
    }

    const assignment = await prisma.memberRoutine.create({
      data: {
        memberId,
        routineId,
        startsAt: new Date(startsAt),
        endsAt: endsAt ? new Date(endsAt) : undefined,
        notes: notes || undefined,
        active: true,
      },
      include: { member: true, routine: true },
    })

    return NextResponse.json(assignment, { status: 201 })
  } catch (error) {
    console.error('Error creating assignment:', error)
    return NextResponse.json({ error: 'Error al asignar rutina' }, { status: 500 })
  }
}
