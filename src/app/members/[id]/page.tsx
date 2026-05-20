'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit2, Save, X, History, Dumbbell } from 'lucide-react'

export default function MemberDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [member, setMember] = useState<any>(null)
  const [routines, setRoutines] = useState<any[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', birthDate: '', active: true
  })

  useEffect(() => {
    fetchMember()
    fetchTrainingHistory()
  }, [params.id])

  const fetchMember = async () => {
    try {
      const res = await fetch(`/api/members/${params.id}`)
      if (!res.ok) throw new Error('Error al cargar miembro')
      const data = await res.json()
      setMember(data)
      setFormData({
        name: data.name || '', email: data.email || '', phone: data.phone || '',
        address: data.address || '', birthDate: data.birthDate ? data.birthDate.split('T')[0] : '',
        active: data.active
      })
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  const fetchTrainingHistory = async () => {
    try {
      const res = await fetch(`/api/members/${params.id}/training-history`)
      if (res.ok) setRoutines(await res.json())
    } catch (err) { console.error(err) }
  }

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/members/${params.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!res.ok) throw new Error('Error al actualizar')
      setMember(await res.json())
      setIsEditing(false)
    } catch (err: any) { setError(err.message) }
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="text-lg">Cargando...</div></div>
  if (error) return <div className="container mx-auto px-4 py-8"><div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div></div>
  if (!member) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/members" className="text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold">Detalle del Miembro</h1>
        </div>
        <Link href={`/members/${params.id}/history`} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          <History className="w-5 h-5" />Ver Historial
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Información Personal</h2>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
              <Edit2 className="w-4 h-4" />Editar
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <Save className="w-4 h-4" />Guardar
              </button>
              <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                <X className="w-4 h-4" />Cancelar
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            {isEditing ? <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required /> : <p className="text-gray-900">{member.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            {isEditing ? <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /> : <p className="text-gray-900">{member.email || '-'}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            {isEditing ? <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /> : <p className="text-gray-900">{member.phone || '-'}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            {isEditing ? (
              <select value={formData.active.toString()} onChange={(e) => setFormData({ ...formData, active: e.target.value === 'true' })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="true">Activo</option><option value="false">Inactivo</option>
              </select>
            ) : (
              <span className={`px-3 py-1 rounded-full text-sm ${member.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{member.active ? 'Activo' : 'Inactivo'}</span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2"><Dumbbell className="w-6 h-6" />Rutinas Asignadas</h2>
          <Link href={`/members/${params.id}/assign-routine`} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">+ Asignar Rutina</Link>
        </div>
        {routines.length === 0 ? <p className="text-gray-500 text-center py-8">No hay rutinas asignadas</p> : (
          <div className="space-y-4">
            {routines.map((mr: any) => (
              <div key={mr.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{mr.routine.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm ${mr.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{mr.active ? 'Activa' : 'Finalizada'}</span>
                </div>
                <div className="text-sm text-gray-500"><p>Sesiones: {mr.sessions.filter((s: any) => s.completed).length} / {mr.sessions.length}</p></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
