import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { Users, CreditCard, Calendar, Bell, Settings, BarChart3 } from 'lucide-react'

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const navItems = [
    { href: '/members', label: 'Miembros', icon: Users, color: 'bg-blue-500' },
    { href: '/payments', label: 'Pagos', icon: CreditCard, color: 'bg-green-500' },
    { href: '/attendance', label: 'Asistencia', icon: Calendar, color: 'bg-purple-500' },
    { href: '/notifications', label: 'Notificaciones', icon: Bell, color: 'bg-yellow-500' },
    { href: '/settings', label: 'Configuración', icon: Settings, color: 'bg-gray-500' },
  ]

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Gym Management</h1>
        <p className="text-muted-foreground mb-8">Bienvenido, {session.user?.name}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-3 p-6 rounded-xl border bg-card hover:bg-accent transition-colors"
            >
              <div className={`p-3 rounded-lg ${item.color} text-white`}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
