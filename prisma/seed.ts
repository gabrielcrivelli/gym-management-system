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
    {
      name: 'Plan Mensual',
      description: 'Acceso completo por 1 mes',
      price: 5000,
      duration: 30,
      active: true,
    },
    {
      name: 'Plan Trimestral',
      description: 'Acceso completo por 3 meses',
      price: 12000,
      duration: 90,
      active: true,
    },
    {
      name: 'Plan Anual',
      description: 'Acceso completo por 12 meses',
      price: 40000,
      duration: 365,
      active: true,
    },
  ]

  for (const plan of plans) {
    const created = await prisma.plan.upsert({
      where: { name: plan.name } as any,
      update: {},
      create: plan,
    })
    console.log('✅ Plan creado:', created.name)
  }

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
