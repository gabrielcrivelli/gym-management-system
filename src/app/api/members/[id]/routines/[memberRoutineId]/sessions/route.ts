import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; memberRoutineId: string } }
) {
  try {
    const { memberRoutineId } = params;

    const sessions = await prisma.trainingSession.findMany({
      where: { memberRoutineId },
      include: {
        exerciseLogs: {
          include: {
            routineExercise: {
              include: {
                exercise: true,
              },
            },
          },
        },
      },
      orderBy: { startTime: 'desc' },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error fetching training sessions:', error);
    return NextResponse.json(
      { error: 'Error al obtener sesiones de entrenamiento' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; memberRoutineId: string } }
) {
  try {
    const { memberRoutineId } = params;
    const body = await request.json();
    const { startTime, endTime, notes, rating } = body;

    const memberRoutine = await prisma.memberRoutine.findUnique({
      where: { id: memberRoutineId },
    });

    if (!memberRoutine) {
      return NextResponse.json(
        { error: 'Rutina de miembro no encontrada' },
        { status: 404 }
      );
    }

    const session = await prisma.trainingSession.create({
      data: {
        memberRoutineId,
        startTime: startTime ? new Date(startTime) : new Date(),
        endTime: endTime ? new Date(endTime) : null,
        notes,
        rating,
      },
      include: {
        exerciseLogs: {
          include: {
            routineExercise: {
              include: {
                exercise: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error('Error creating training session:', error);
    return NextResponse.json(
      { error: 'Error al crear sesión de entrenamiento' },
      { status: 500 }
    );
  }
}
