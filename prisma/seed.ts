import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin123!', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gym.com' },
    update: {},
    create: {
      email: 'admin@gym.com',
      name: 'Administrador',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin creado:', admin.email)

  // Create default plans
  const plans = [
    { name: 'Plan Mensual', description: 'Acceso completo por 1 mes', price: 5000, duration: 30, active: true },
    { name: 'Plan Trimestral', description: 'Acceso completo por 3 meses', price: 12000, duration: 90, active: true },
    { name: 'Plan Anual', description: 'Acceso completo por 12 meses', price: 40000, duration: 365, active: true },
  ]
  for (const plan of plans) {
    const created = await prisma.plan.upsert({
      where: { name: plan.name },
      update: {},
      create: plan,
    })
    console.log('✅ Plan creado:', created.name)
  }

  // Create Equipment
  const equipmentData = [
    { name: 'Peso corporal', category: 'BODYWEIGHT', description: 'Sin equipamiento (calistenia)' },
    { name: 'Mancuernas', category: 'DUMBBELL', description: 'Mancuernas de 2kg a 30kg' },
    { name: 'Barra olímpica', category: 'BARBELL', description: 'Barra con discos' },
    { name: 'Pesas rusas (Kettlebells)', category: 'KETTLEBELL', description: 'Kettlebells de 8kg a 24kg' },
    { name: 'Cajón pliométrico', category: 'PLYOMETRIC_BOX', description: 'Para saltos y steps' },
    { name: 'Tobilleras con peso', category: 'ANKLE_WEIGHTS', description: 'Para trabajo de piernas' },
    { name: 'Cintas de resistencia', category: 'RESISTANCE_BAND', description: 'Bandas elásticas' },
  ]
  const equipment = []
  for (const eq of equipmentData) {
    const created = await prisma.equipment.upsert({
      where: { name: eq.name },
      update: {},
      create: eq as any,
    })
    equipment.push(created)
    console.log('✅ Equipamiento:', created.name)
  }

  // Create Exercises
  const exercisesData = [
    // BODYWEIGHT - Pecho
    { name: 'Push-up', description: 'Flexión de pecho', muscleGroup: 'CHEST', equipmentId: equipment[0].id, usesWeight: false, weightUnit: 'BODYWEIGHT' },
    { name: 'Flexión de pecho con rodillas', description: 'Push-up modificado', muscleGroup: 'CHEST', equipmentId: equipment[0].id, usesWeight: false, weightUnit: 'BODYWEIGHT' },
    // BODYWEIGHT - Espalda
    { name: 'Pull-up', description: 'Dominada', muscleGroup: 'BACK', equipmentId: equipment[0].id, usesWeight: false, weightUnit: 'BODYWEIGHT' },
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
    console.log('✅ Ejercicio:', created.name)
  }

  // Create sample routines
  const calistenicRoutine = await prisma.routine.upsert({
    where: { id: 'calistenia-basica' },
    update: {},
    create: {
      id: 'calistenia-basica',
      name: 'Calistenia Básica',
      description: 'Rutina de peso corporal para principiantes',
      objective: 'Fuerza y resistencia',
      durationWeeks: 8,
    },
  })
  console.log('✅ Rutina:', calistenicRoutine.name)

  const mancuernasRoutine = await prisma.routine.upsert({
    where: { id: 'fuerza-mancuernas' },
    update: {},
    create: {
      id: 'fuerza-mancuernas',
      name: 'Fuerza con Mancuernas',
      description: 'Rutina de fuerza con mancuernas',
      objective: 'Hipertrofia',
      durationWeeks: 12,
    },
  })
  console.log('✅ Rutina:', mancuernasRoutine.name)

  console.log('🎉 Seed completado!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
