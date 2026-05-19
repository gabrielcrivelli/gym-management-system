import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const memberId = params.id;

    const memberRoutines = await prisma.memberRoutine.findMany({
      where: { memberId },
      include: {
        routine: {
          include: {
            exercises: {
              include: {
                exercise: true,
              },
            },
          },
        },
      },
      orderBy: { assignedAt: 'desc' },
    });

    return NextResponse.json(memberRoutines);
  } catch (error) {
    console.error('Error fetching member routines:', error);
    return NextResponse.json(
      { error: 'Error al obtener rutinas del miembro' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const memberId = params.id;
    const body = await request.json();
    const { routineId, assignedBy, status, notes } = body;

    // Verificar que el miembro existe
    const member = await prisma.member.findUnique({
      where: { id: memberId },
    });

    if (!member) {
      return NextResponse.json(
        { error: 'Miembro no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que la rutina existe
    const routine = await prisma.routine.findUnique({
      where: { id: routineId },
    });

    if (!routine) {
      return NextResponse.json(
        { error: 'Rutina no encontrada' },
        { status: 404 }
      );
    }

    const memberRoutine = await prisma.memberRoutine.create({
      data: {
        memberId,
        routineId,
        assignedBy,
        status: status || 'ACTIVE',
        notes,
      },
      include: {
        routine: {
          include: {
            exercises: {
              include: {
                exercise: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(memberRoutine, { status: 201 });
  } catch (error) {
    console.error('Error assigning routine to member:', error);
    return NextResponse.json(
      { error: 'Error al asignar rutina al miembro' },
      { status: 500 }
    );
  }
}
