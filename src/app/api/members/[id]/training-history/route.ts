import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const memberId = params.id

    // Obtener todas las rutinas asignadas al miembro con sus sesiones
    const memberRoutines = await prisma.memberRoutine.findMany({
      where: {
        memberId,
      },
      include: {
        routine: {
          include: {
            exercises: {
              include: {
                exercise: {
                  include: {
                    equipment: true,
                  },
                },
              },
            },
          },
        },
        sessions: {
          include: {
            exerciseLogs: {
              include: {
                exercise: true,
              },
            },
          },
          orderBy: {
            sessionDate: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(memberRoutines)
  } catch (error) {
    console.error('Error fetching training history:', error)
    return NextResponse.json(
      { error: 'Error al obtener el historial de entrenamiento' },
      { status: 500 }
    )
  }
}
