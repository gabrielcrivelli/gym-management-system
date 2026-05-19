'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Dumbbell, Plus } from 'lucide-react'

interface Routine {
  id: string
  name: string
  description?: string
  objective?: string
  exercises: { id: string }[]
  _count: { assignments: number }
}

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/routines')
      .then(res => res.json())
      .then(data => { setRoutines(data); setLoading(false) })
  }, [])

  if (loading) return <div className="p-8">Cargando rutinas...</div>

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rutinas</h1>
          <p className="text-gray-500 mt-1">Gestiona las rutinas de entrenamiento</p>
        </div>
        <Link href="/routines/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nueva Rutina
        </Link>
      </div>

      {routines.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Dumbbell className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">No hay rutinas creadas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routines.map(routine => (
            <Link key={routine.id} href={`/routines/${routine.id}`} className="bg-white border rounded-lg p-6 hover:shadow-lg transition">
              <h3 className="font-bold text-lg text-gray-900 mb-2">{routine.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{routine.description || 'Sin descripción'}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{routine.exercises?.length || 0} ejercicios</span>
                <span>{routine._count?.assignments || 0} asignaciones</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
