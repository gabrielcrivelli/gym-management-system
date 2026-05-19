'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, UserCheck, CheckCircle, Clock } from 'lucide-react'

interface AttendanceRecord {
  id: string
  memberId: string
  checkIn: string
  checkOut?: string
  member?: { name: string }
}

interface Member {
  id: string
  name: string
}

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [memberId, setMemberId] = useState('')
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [attRes, memRes] = await Promise.all([
        fetch('/api/attendance'),
        fetch('/api/members')
      ])
      if (attRes.ok) setRecords(await attRes.json())
      if (memRes.ok) setMembers(await memRes.json())
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function registerCheckIn(e: React.FormEvent) {
    e.preventDefault()
    if (!memberId) return
    setSaving(true)
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId })
      })
      if (!res.ok) throw new Error('Error al registrar asistencia')
      setMemberId('')
      fetchData()
    } catch (e: any) { alert(e.message) }
    finally { setSaving(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.push('/')} className="flex items-center gap-2 text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 transition">
            <ArrowLeft className="w-4 h-4" /> Inicio
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Control de Asistencia</h1>
        </div>

        <form onSubmit={registerCheckIn} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">Registrar entrada</h2>
          <div className="flex gap-3">
            <select
              value={memberId}
              onChange={e => setMemberId(e.target.value)}
              required
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar miembro...</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <button type="submit" disabled={saving || !memberId} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition">
              <UserCheck className="w-4 h-4" />{saving ? 'Registrando...' : 'Registrar entrada'}
            </button>
          </div>
        </form>

        {loading && <p className="text-center text-gray-500 py-8">Cargando registros...</p>}
        {error && <p className="text-center text-red-500 py-8">{error}</p>}
        {!loading && records.length === 0 && <p className="text-center text-gray-500 py-8">No hay registros de asistencia.</p>}

        <div className="grid gap-3">
          {records.map(r => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  {r.checkOut ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Clock className="w-5 h-5 text-blue-600" />}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{r.member?.name ?? r.memberId}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-gray-500">Entrada: {new Date(r.checkIn).toLocaleString('es-AR')}</span>
                    {r.checkOut && <span className="text-xs text-gray-500">Salida: {new Date(r.checkOut).toLocaleString('es-AR')}</span>}
                  </div>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.checkOut ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                {r.checkOut ? 'Completado' : 'En curso'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
