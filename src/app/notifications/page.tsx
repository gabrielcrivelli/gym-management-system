'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Bell, Send } from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  type: string
  sent: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', message: '', type: 'INFO' })
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => { fetchNotifications() }, [])

  async function fetchNotifications() {
    try {
      const res = await fetch('/api/notifications')
      if (res.ok) setNotifications(await res.json())
    } catch {}
    finally { setLoading(false) }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error('Error al enviar')
      setForm({ title: '', message: '', type: 'INFO' })
      setShowForm(false)
      fetchNotifications()
    } catch (e: any) { alert(e.message) }
    finally { setSaving(false) }
  }

  const typeColors: Record<string, string> = {
    INFO: 'bg-blue-100 text-blue-700',
    WARNING: 'bg-yellow-100 text-yellow-700',
    SUCCESS: 'bg-green-100 text-green-700',
    ERROR: 'bg-red-100 text-red-700',
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.push('/')} className="flex items-center gap-2 text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 transition">
            <ArrowLeft className="w-4 h-4" /> Inicio
          </button>
          <h1 className="text-2xl font-bold text-gray-900 flex-1">Notificaciones</h1>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            <Send className="w-4 h-4" /> Nueva notificación
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-5 space-y-4">
            <h2 className="font-semibold text-gray-900">Nueva Notificación</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
              <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Aviso importante" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje *</label>
              <textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={3} placeholder="Escriba el mensaje aqui..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="INFO">Información</option>
                <option value="WARNING">Advertencia</option>
                <option value="SUCCESS">Éxito</option>
                <option value="ERROR">Error</option>
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancelar</button>
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                <Send className="w-3 h-3" />{saving ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </form>
        )}

        {loading && <p className="text-center text-gray-500 py-8">Cargando notificaciones...</p>}
        {!loading && notifications.length === 0 && <p className="text-center text-gray-500 py-8">No hay notificaciones.</p>}

        <div className="grid gap-3">
          {notifications.map(n => (
            <div key={n.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-blue-500" />
                  <p className="font-semibold text-gray-900">{n.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[n.type] ?? 'bg-gray-100 text-gray-500'}`}>{n.type}</span>
                  <span className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleDateString('es-AR')}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 ml-8">{n.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
