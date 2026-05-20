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
    const { name, description, difficulty, duration, isActive, exercises, memberId } = body


    // Crear rutina, ejercicios y asignación en una transacción
    const result = await db.$transaction(async (tx) => {
      // 1. Crear la rutina
      const routine = await tx.routine.create({
        data: {
          name,
          description: description || null,
          active: isActive !== undefined ? isActive : true,
        }
      })

      // 2. Agregar ejercicios a la rutina si existen
      if (exercises && Array.isArray(exercises) && exercises.length > 0) {
        const routineExercises = exercises.map((ex: any) => ({
          routineId: routine.id,
          exerciseId: ex.exerciseId || ex.id,
          sets: ex.sets || 3,
          reps: ex.reps || 10,
          restSeconds: ex.restSeconds || 60,
          notes: ex.notes || null,
        }))

        await tx.routineExercise.createMany({
          data: routineExercises
        })
      }

      if (memberId) {
      // 3. Asignar rutina al miembro
      await tx.memberRoutine.create({
        data: {
          memberId,
          routineId: routine.id,
        }
      })
      }

      // Retornar la rutina con sus ejercicios
      return await tx.routine.findUnique({
        where: { id: routine.id },
        include: {
          exercises: {
            include: {
              exercise: true
            }
          },
          assignments: {
            include: {
              member: true
            }
          }
        }
      })
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    console.error('Error creating routine:', error)
    return NextResponse.json(
      { error: 'Error al crear la rutina: ' + error.message },
      { status: 500 }
    )
  }
}
