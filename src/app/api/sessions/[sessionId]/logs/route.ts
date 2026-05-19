import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;

    const logs = await prisma.sessionExerciseLog.findMany({
      where: { sessionId },
      include: {
        routineExercise: {
          include: {
            exercise: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching session logs:', error);
    return NextResponse.json(
      { error: 'Error al obtener registros de sesión' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;
    const body = await request.json();
    const { routineExerciseId, setsCompleted, repsCompleted, weightUsed, notes } = body;

    const session = await prisma.trainingSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Sesión de entrenamiento no encontrada' },
        { status: 404 }
      );
    }

    const log = await prisma.sessionExerciseLog.create({
      data: {
        sessionId,
        routineExerciseId,
        setsCompleted: setsCompleted || 0,
        repsCompleted: repsCompleted || 0,
        weightUsed: weightUsed || 0,
        notes,
      },
      include: {
        routineExercise: {
          include: {
            exercise: true,
          },
        },
      },
    });

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error('Error creating session log:', error);
    return NextResponse.json(
      { error: 'Error al crear registro de ejercicio' },
      { status: 500 }
    );
  }
}
