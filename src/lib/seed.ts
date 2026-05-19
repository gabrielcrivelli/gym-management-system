import { db } from './db'
import bcrypt from 'bcryptjs'

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  await db.user.upsert({
    where: { email: 'admin@gym.com' },
    update: {},
    create: {
      email: 'admin@gym.com',
      name: 'Administrador',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  await db.plan.createMany({
    data: [
      { name: 'Mensual', description: 'Acceso completo por 30 días', price: 5000, duration: 30 },
      { name: 'Trimestral', description: 'Acceso completo por 90 días', price: 12000, duration: 90 },
      { name: 'Anual', description: 'Acceso completo por 365 días', price: 40000, duration: 365 },
    ],
    skipDuplicates: true,
  })

  console.log('Seed completed!')
}

main().catch(console.error).finally(() => db.$disconnect())
