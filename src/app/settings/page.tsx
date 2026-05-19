'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Settings, Save } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    gymName: 'Mi Gimnasio',
    address: '',
    phone: '',
    email: '',
    currency: 'ARS',
    timezone: 'America/Argentina/Buenos_Aires'
  })
  const [saved, setSaved] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch {}
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.push('/')} className="flex items-center gap-2 text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 transition">
            <ArrowLeft className="w-4 h-4" /> Inicio
          </button>
          <Settings className="w-6 h-6 text-gray-500" />
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        </div>

        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-4 text-sm">
            ¡Configuración guardada correctamente!
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 text-lg">Datos del Gimnasio</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del gimnasio</label>
            <input name="gymName" value={form.gymName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input name="address" value={form.address} onChange={handleChange} placeholder="Av. Corrientes 1234" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+54 11 1234-5678" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email de contacto</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="info@gimnasio.com" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Moneda</label>
              <select name="currency" value={form.currency} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="ARS">ARS - Peso Argentino</option>
                <option value="USD">USD - Dólar</option>
                <option value="BRL">BRL - Real Brasileño</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zona horaria</label>
              <select name="timezone" value={form.timezone} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="America/Argentina/Buenos_Aires">Buenos Aires (ART)</option>
                <option value="America/Sao_Paulo">São Paulo (BRT)</option>
                <option value="America/New_York">New York (EST)</option>
                <option value="Europe/Madrid">Madrid (CET)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
              <Save className="w-4 h-4" /> Guardar configuración
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
