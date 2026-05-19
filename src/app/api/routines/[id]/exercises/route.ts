import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const routineId = params.id;

    const exercises = await prisma.routineExercise.findMany({
      where: { routineId },
      include: {
        exercise: true,
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(exercises);
  } catch (error) {
    console.error('Error fetching routine exercises:', error);
    return NextResponse.json(
      { error: 'Error al obtener ejercicios de la rutina' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const routineId = params.id;
    const body = await request.json();
    const { exerciseId, sets, reps, restSeconds, notes, order } = body;

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

    // Verificar que el ejercicio existe
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) {
      return NextResponse.json(
        { error: 'Ejercicio no encontrado' },
        { status: 404 }
      );
    }

    const routineExercise = await prisma.routineExercise.create({
      data: {
        routineId,
        exerciseId,
        sets: sets || 3,
        reps: reps || 10,
        restSeconds: restSeconds || 60,
        notes,
        order: order || 0,
      },
      include: {
        exercise: true,
      },
    });

    return NextResponse.json(routineExercise, { status: 201 });
  } catch (error) {
    console.error('Error creating routine exercise:', error);
    return NextResponse.json(
      { error: 'Error al crear ejercicio en rutina' },
      { status: 500 }
    );
  }
}
