'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UserPlus, ArrowLeft, Trash2, Phone, Mail, User } from 'lucide-react'

interface Member {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  createdAt: string
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchMembers()
  }, [])

  async function fetchMembers() {
    try {
      const res = await fetch('/api/members')
      if (!res.ok) throw new Error('Error al cargar miembros')
      const data = await res.json()
      setMembers(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function deleteMember(id: string) {
    if (!confirm('\u00bfEliminar este miembro?')) return
    try {
      const res = await fetch(`/api/members/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error al eliminar')
      setMembers(members.filter(m => m.id !== id))
    } catch (e: any) {
      alert(e.message)
    }
  }

  const filtered = members.filter(m =>
    `${m.firstName} ${m.lastName} ${m.email}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.push('/')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 transition">
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </button>
          <h1 className="text-2xl font-bold text-gray-900 flex-1">Miembros</h1>
          <Link href="/members/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            <UserPlus className="w-4 h-4" /> Nuevo miembro
          </Link>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading && <p className="text-center text-gray-500 py-8">Cargando miembros...</p>}
        {error && <p className="text-center text-red-500 py-8">{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p className="text-center text-gray-500 py-8">No se encontraron miembros.</p>
        )}

        <div className="grid gap-4">
          {filtered.map(member => (
            <div key={member.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{member.firstName} {member.lastName}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1 text-xs text-gray-500"><Mail className="w-3 h-3" />{member.email}</span>
                    {member.phone && <span className="flex items-center gap-1 text-xs text-gray-500"><Phone className="w-3 h-3" />{member.phone}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{new Date(member.createdAt).toLocaleDateString('es-AR')}</span>
                <button onClick={() => deleteMember(member.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Eliminar">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
