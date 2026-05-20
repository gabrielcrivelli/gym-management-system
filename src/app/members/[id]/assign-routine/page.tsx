'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

export default function AssignRoutinePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [routines, setRoutines] = useState<any[]>([])
  const [memberName, setMemberName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    routineId: '', startsAt: new Date().toISOString().split('T')[0], endsAt: '', notes: ''
  })

  useEffect(() => { fetchData() }, [params.id])

  const fetchData = async () => {
    try {
      const memberRes = await fetch(`/api/members/${params.id}`)
      if (!memberRes.ok) throw new Error('Error al cargar miembro')
      const memberData = await memberRes.json()
      setMemberName(memberData.name)

      const routinesRes = await fetch('/api/routines')
      if (!routinesRes.ok) throw new Error('Error al cargar rutinas')
      const routinesData = await routinesRes.json()
      setRoutines(routinesData.filter((r: any) => r.active))
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.routineId) { setError('Debes seleccionar una rutina'); return }

    try {
      const res = await fetch('/api/routines/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: params.id,
          routineId: formData.routineId,
          startsAt: new Date(formData.startsAt),
          endsAt: formData.endsAt ? new Date(formData.endsAt) : undefined,
          notes: formData.notes || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al asignar rutina')
      }
      router.push(`/members/${params.id}`)
    } catch (err: any) { setError(err.message) }
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="text-lg">Cargando...</div></div>

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/members/${params.id}`} className="text-blue-600 hover:text-blue-700">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Asignar Rutina</h1>
          <p className="text-gray-600">Miembro: {memberName}</p>
        </div>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <label htmlFor="routineId" className="block text-sm font-medium text-gray-700 mb-2">Rutina *</label>
          <select id="routineId" value={formData.routineId} onChange={(e) => setFormData({ ...formData, routineId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
            <option value="">Seleccionar rutina...</option>
            {routines.map((routine) => (
              <option key={routine.id} value={routine.id}>{routine.name}{routine.objective && ` - ${routine.objective}`}</option>
            ))}
          </select>
          {formData.routineId && routines.find(r => r.id === formData.routineId)?.description && (
            <p className="mt-2 text-sm text-gray-600">{routines.find(r => r.id === formData.routineId)?.description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio *</label>
            <input type="date" value={formData.startsAt} onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Fin</label>
            <input type="date" value={formData.endsAt} onChange={(e) => setFormData({ ...formData, endsAt: e.target.value })} min={formData.startsAt} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notas</label>
          <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Instrucciones especiales, modificaciones, etc." />
        </div>

        <div className="flex gap-3">
          <button type="submit" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            <Save className="w-5 h-5" />Asignar Rutina
          </button>
          <Link href={`/members/${params.id}`} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">Cancelar</Link>
        </div>
      </form>
    </div>
  )
}
