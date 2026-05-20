import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Check if seed has already been run
    const existingEquipment = await prisma.equipment.count()
    if (existingEquipment > 0) {
      return NextResponse.json({ 
        message: 'Database already seeded',
        equipmentCount: existingEquipment 
      })
    }

    // Create Equipment
    const equipmentData = [
      { name: 'Peso corporal', category: 'BODYWEIGHT', description: 'Sin equipamiento (calistenia)' },
      { name: 'Mancuernas', category: 'DUMBBELL', description: 'Mancuernas de 2kg a 30kg+' },
      { name: 'Barra olímpica', category: 'BARBELL', description: 'Barra con discos para fuerza' },
      { name: 'Pesas rusas (kettlebells)', category: 'KETTLEBELL', description: 'Kettlebells de 8kg a 32kg' },
      { name: 'Cajón pliométrico', category: 'PLYOMETRIC_BOX', description: 'Para saltos y steps' },
      { name: 'Tobilleras con peso', category: 'ANKLE_WEIGHTS', description: 'Para trabajo de piernas' },
      { name: 'Cintas de resistencia', category: 'RESISTANCE_BAND', description: 'Bandas elásticas de resistencia' },
    ]
    
    const equipment: any[] = []
    for (const eq of equipmentData) {
      const created = await prisma.equipment.upsert({
        where: { name: eq.name },
        update: {},
        create: eq as any,
      })
      equipment.push(created)
    }

    // Create Exercises
    const exercisesData = [
      // BODYWEIGHT - Espalda
      { name: 'Push-up', description: 'Flexión de pecho', muscleGroup: 'CHEST', equipmentId: equipment[0].id, usesWeight: false, weightUnit: 'BODYWEIGHT' },
      { name: 'Pull-up', description: 'Dominadas', muscleGroup: 'BACK', equipmentId: equipment[0].id, usesWeight: false, weightUnit: 'BODYWEIGHT' },
      { name: 'Superman', description: 'Ejercicio lumbar', muscleGroup: 'BACK', equipmentId: equipment[0].id, usesWeight: false, weightUnit: 'BODYWEIGHT' },
      
      // BODYWEIGHT - Core
      { name: 'Plancha', description: 'Isométrico de core', muscleGroup: 'CORE', equipmentId: equipment[0].id, usesWeight: false, weightUnit: 'BODYWEIGHT' },
      { name: 'Mountain climber', description: 'Escalador', muscleGroup: 'CORE', equipmentId: equipment[0].id, usesWeight: false, weightUnit: 'BODYWEIGHT' },
      
      // BODYWEIGHT - Piernas
      { name: 'Sentadilla libre', description: 'Squat sin peso', muscleGroup: 'LEGS', equipmentId: equipment[0].id, usesWeight: false, weightUnit: 'BODYWEIGHT' },
      { name: 'Zancada', description: 'Lunge', muscleGroup: 'LEGS', equipmentId: equipment[0].id, usesWeight: false, weightUnit: 'BODYWEIGHT' },
      
      // BODYWEIGHT - Full Body
      { name: 'Burpee', description: 'Ejercicio compuesto', muscleGroup: 'FULL_BODY', equipmentId: equipment[0].id, usesWeight: false, weightUnit: 'BODYWEIGHT' },
      { name: 'Jumping jack', description: 'Salto de tijera', muscleGroup: 'FULL_BODY', equipmentId: equipment[0].id, usesWeight: false, weightUnit: 'BODYWEIGHT' },
      
      // DUMBBELL - Hombros
      { name: 'Press de hombros con mancuernas', description: 'Shoulder press', muscleGroup: 'SHOULDERS', equipmentId: equipment[1].id, usesWeight: true, weightUnit: 'KG' },
      { name: 'Elevación lateral', description: 'Lateral raise', muscleGroup: 'SHOULDERS', equipmentId: equipment[1].id, usesWeight: true, weightUnit: 'KG' },
      
      // DUMBBELL - Brazos
      { name: 'Curl de bíceps', description: 'Bicep curl', muscleGroup: 'ARMS', equipmentId: equipment[1].id, usesWeight: true, weightUnit: 'KG' },
      { name: 'Extensión de tríceps', description: 'Tricep extension', muscleGroup: 'ARMS', equipmentId: equipment[1].id, usesWeight: true, weightUnit: 'KG' },
      
      // DUMBBELL - Piernas
      { name: 'Sentadilla goblet', description: 'Goblet squat', muscleGroup: 'LEGS', equipmentId: equipment[1].id, usesWeight: true, weightUnit: 'KG' },
      { name: 'Peso muerto rumano', description: 'Romanian deadlift', muscleGroup: 'LEGS', equipmentId: equipment[1].id, usesWeight: true, weightUnit: 'KG' },
      
      // BARBELL
      { name: 'Sentadilla con barra', description: 'Back squat', muscleGroup: 'LEGS', equipmentId: equipment[2].id, usesWeight: true, weightUnit: 'KG' },
      { name: 'Peso muerto', description: 'Deadlift', muscleGroup: 'BACK', equipmentId: equipment[2].id, usesWeight: true, weightUnit: 'KG' },
      { name: 'Press de banca', description: 'Bench press', muscleGroup: 'CHEST', equipmentId: equipment[2].id, usesWeight: true, weightUnit: 'KG' },
      
      // KETTLEBELL
      { name: 'Swing con kettlebell', description: 'KB swing', muscleGroup: 'FULL_BODY', equipmentId: equipment[3].id, usesWeight: true, weightUnit: 'KG' },
      { name: 'Goblet squat con kettlebell', description: 'KB goblet squat', muscleGroup: 'LEGS', equipmentId: equipment[3].id, usesWeight: true, weightUnit: 'KG' },
    ]
    
    const exercises = []
    for (const ex of exercisesData) {
      const created = await prisma.exercise.upsert({
        where: { name: ex.name },
        update: {},
        create: ex as any,
      })
      exercises.push(created)
    }

    return NextResponse.json({ 
      success: true,
      message: 'Database seeded successfully',
      stats: {
        equipment: equipment.length,
        exercises: exercises.length
      }
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to seed database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
