'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, CreditCard, DollarSign } from 'lucide-react'

interface Payment {
  id: string
  amount: number
  method: string
  status: string
  paidAt?: string
  createdAt: string
  member?: { name: string }
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ amount: '', method: 'CASH', status: 'PAID', membershipId: '' })
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => { fetchPayments() }, [])

  async function fetchPayments() {
    try {
      const res = await fetch('/api/payments')
      if (!res.ok) throw new Error('Error al cargar pagos')
      const data = await res.json()
      setPayments(data)
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, amount: parseFloat(form.amount), paidAt: form.status === 'PAID' ? new Date().toISOString() : null })
      })
      if (!res.ok) throw new Error('Error al guardar pago')
      setForm({ amount: '', method: 'CASH', status: 'PAID', membershipId: '' })
      setShowForm(false)
      fetchPayments()
    } catch (e: any) { alert(e.message) }
    finally { setSaving(false) }
  }

  const statusColors: Record<string, string> = {
    PAID: 'bg-green-100 text-green-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }
  const methodLabels: Record<string, string> = { CASH: 'Efectivo', CARD: 'Tarjeta', TRANSFER: 'Transferencia' }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.push('/')} className="flex items-center gap-2 text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 transition">
            <ArrowLeft className="w-4 h-4" /> Inicio
          </button>
          <h1 className="text-2xl font-bold text-gray-900 flex-1">Pagos</h1>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            <Plus className="w-4 h-4" /> Registrar pago
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-5 space-y-4">
            <h2 className="font-semibold text-gray-900">Nuevo Pago</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monto *</label>
                <input type="number" step="0.01" required value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="0.00" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Método</label>
                <select value={form.method} onChange={e => setForm({...form, method: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="CASH">Efectivo</option>
                  <option value="CARD">Tarjeta</option>
                  <option value="TRANSFER">Transferencia</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="PAID">Pagado</option>
                  <option value="PENDING">Pendiente</option>
                  <option value="CANCELLED">Cancelado</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancelar</button>
              <button type="submit" disabled={saving} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">{saving ? 'Guardando...' : 'Guardar'}</button>
            </div>
          </form>
        )}

        {loading && <p className="text-center text-gray-500 py-8">Cargando pagos...</p>}
        {error && <p className="text-center text-red-500 py-8">{error}</p>}
        {!loading && payments.length === 0 && <p className="text-center text-gray-500 py-8">No hay pagos registrados.</p>}

        <div className="grid gap-3">
          {payments.map(p => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">${p.amount.toFixed(2)}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500"><CreditCard className="w-3 h-3 inline mr-1" />{methodLabels[p.method] ?? p.method}</span>
                    {p.member && <span className="text-xs text-gray-500">{p.member.name}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[p.status] ?? 'bg-gray-100 text-gray-500'}`}>{p.status === 'PAID' ? 'Pagado' : p.status === 'PENDING' ? 'Pendiente' : 'Cancelado'}</span>
                <span className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString('es-AR')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
