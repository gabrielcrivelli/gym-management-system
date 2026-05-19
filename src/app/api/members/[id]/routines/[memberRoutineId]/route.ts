import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; memberRoutineId: string } }
) {
  try {
    const { memberRoutineId } = params;

    const memberRoutine = await prisma.memberRoutine.findUnique({
      where: { id: memberRoutineId },
      include: {
        routine: {
          include: {
            exercises: {
              include: {
                exercise: true,
              },
              orderBy: { order: 'asc' },
            },
          },
        },
        member: true,
      },
    });

    if (!memberRoutine) {
      return NextResponse.json(
        { error: 'Rutina de miembro no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(memberRoutine);
  } catch (error) {
    console.error('Error fetching member routine:', error);
    return NextResponse.json(
      { error: 'Error al obtener rutina del miembro' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; memberRoutineId: string } }
) {
  try {
    const { memberRoutineId } = params;
    const body = await request.json();
    const { status, notes } = body;

    const memberRoutine = await prisma.memberRoutine.update({
      where: { id: memberRoutineId },
      data: {
        status,
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

    return NextResponse.json(memberRoutine);
  } catch (error) {
    console.error('Error updating member routine:', error);
    return NextResponse.json(
      { error: 'Error al actualizar rutina del miembro' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; memberRoutineId: string } }
) {
  try {
    const { memberRoutineId } = params;

    await prisma.memberRoutine.delete({
      where: { id: memberRoutineId },
    });

    return NextResponse.json(
      { message: 'Rutina eliminada exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting member routine:', error);
    return NextResponse.json(
      { error: 'Error al eliminar rutina del miembro' },
      { status: 500 }
    );
  }
}
