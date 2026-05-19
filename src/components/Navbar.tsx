'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { Menu, X, Dumbbell, Users, CreditCard, Calendar, Bell, Settings, Home, LogOut } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/members', label: 'Miembros', icon: Users },
  { href: '/payments', label: 'Pagos', icon: CreditCard },
  { href: '/attendance', label: 'Asistencia', icon: Calendar },
  { href: '/notifications', label: 'Notificaciones', icon: Bell },
  { href: '/routines', label: 'Rutinas', icon: Dumbbell },
  { href: '/settings', label: 'Configuracion', icon: Settings },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()

  const isAuthenticated = status === 'authenticated' && !!session

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <Dumbbell className="w-6 h-6" />
            <span>GymManager</span>
          </Link>

          {/* Desktop menu - only show when authenticated */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors ml-2"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            </div>
          )}

          {/* Mobile menu button - only show when authenticated */}
          {isAuthenticated && (
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isAuthenticated && open && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-2 space-y-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === href
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 w-full"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesion
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
