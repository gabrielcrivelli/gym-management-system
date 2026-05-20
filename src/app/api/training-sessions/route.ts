// API para sesiones de entrenamiento
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Obtener todas las sesiones de entrenamiento
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const memberId = searchParams.get('memberId')
    const memberRoutineId = searchParams.get('memberRoutineId')

    const where: any = {}
    if (memberId) {
      where.memberRoutine = { memberId }
    }
    if (memberRoutineId) {
      where.memberRoutineId
    }

    const sessions = await db.trainingSession.findMany({
      where,
      include: {
        memberRoutine: {
          include: {
            member: true,
            routine: true
          }
        },
        exerciseLogs: {
          include: {
            exercise: true
          },
          orderBy: { setNumber: 'asc' }
        }
      },
      orderBy: { sessionDate: 'desc' }
    })

    return NextResponse.json(sessions)
  } catch (error: any) {
    console.error('Error fetching training sessions:', error)
    return NextResponse.json(
      { error: 'Error al obtener las sesiones: ' + error.message },
      { status: 500 }
    )
  }
}

// POST - Crear una nueva sesión de entrenamiento
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      memberRoutineId,
      sessionDate,
      durationMinutes,
      completed,
      notes,
      exerciseLogs
    } = body

    // Validación
    if (!memberRoutineId) {
      return NextResponse.json(
        { error: 'memberRoutineId es obligatorio' },
        { status: 400 }
      )
    }

    // Crear sesión y logs en una transacción
    const result = await db.$transaction(async (tx) => {
      // Crear la sesión
      const session = await tx.trainingSession.create({
        data: {
          memberRoutineId,
          sessionDate: sessionDate ? new Date(sessionDate) : new Date(),
          durationMinutes: durationMinutes || 0,
          completed: completed !== undefined ? completed : true,
          notes: notes || null
        }
      })

      // Crear logs de ejercicios si existen
      if (exerciseLogs && Array.isArray(exerciseLogs) && exerciseLogs.length > 0) {
        const logs = exerciseLogs.map((log: any) => ({
          sessionId: session.id,
          exerciseId: log.exerciseId,
          setNumber: log.setNumber || 1,
          reps: log.reps || 0,
          weight: log.weight || null,
          weightUnit: log.weightUnit || 'KG',
          notes: log.notes || null
        }))

        await tx.sessionExerciseLog.createMany({
          data: logs
        })
      }

      // Retornar la sesión completa
      return await tx.trainingSession.findUnique({
        where: { id: session.id },
        include: {
          memberRoutine: {
            include: {
              member: true,
              routine: {
                include: {
                  exercises: {
                    include: {
                      exercise: true
                    }
                  }
                }
              }
            }
          },
          exerciseLogs: {
            include: {
              exercise: true
            },
            orderBy: { setNumber: 'asc' }
          }
        }
      })
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    console.error('Error creating training session:', error)
    return NextResponse.json(
      { error: 'Error al crear la sesión de entrenamiento: ' + error.message },
      { status: 500 }
    )
  }
}
