'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dumbbell, Calendar, Clock, Users, Edit, Trash2, ArrowLeft } from 'lucide-react'

interface Exercise {
  id: string
  sets: number
  reps: string
  restSeconds: number
  notes?: string
  order: number
  exercise: {
    id: string
    name: string
    muscleGroup: string
  }
}

interface Routine {
  id: string
  name: string
  description?: string
  objective?: string
  durationWeeks?: number
  active: boolean
  exercises: Exercise[]
  _count: {
    assignments: number
  }
}

export default function RoutineDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [routine, setRoutine] = useState<Routine | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRoutine()
  }, [params.id])

  const fetchRoutine = async () => {
    try {
      const res = await fetch(`/api/routines/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setRoutine(data)
      }
    } catch (error) {
      console.error('Error al cargar rutina:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar esta rutina?')) return

    try {
      const res = await fetch(`/api/routines/${params.id}`, { method: 'DELETE' })
      if (res.ok) {
        router.push('/routines')
      }
    } catch (error) {
      console.error('Error al eliminar:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!routine) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Rutina no encontrada</h2>
          <button
            onClick={() => router.push('/routines')}
            className="text-blue-600 hover:text-blue-700"
          >
            Volver a rutinas
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/routines')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => router.push(`/routines/${params.id}/edit`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Edit className="w-4 h-4" />
            Editar
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>
        </div>
      </div>

      {/* Routine Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{routine.name}</h1>
            {routine.description && (
              <p className="text-gray-600">{routine.description}</p>
            )}
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            routine.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {routine.active ? 'Activa' : 'Inactiva'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {routine.objective && (
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <Dumbbell className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Objetivo</p>
                <p className="font-medium text-gray-900">{routine.objective}</p>
              </div>
            </div>
          )}
          {routine.durationWeeks && (
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Duración</p>
                <p className="font-medium text-gray-900">{routine.durationWeeks} semanas</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
            <Clock className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Ejercicios</p>
              <p className="font-medium text-gray-900">{routine.exercises.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <Users className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Asignaciones</p>
              <p className="font-medium text-gray-900">{routine._count.assignments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Exercises List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Ejercicios</h2>
        {routine.exercises.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay ejercicios en esta rutina</p>
        ) : (
          <div className="space-y-4">
            {routine.exercises
              .sort((a, b) => a.order - b.order)
              .map((ex, index) => (
                <div
                  key={ex.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{ex.exercise.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{ex.exercise.muscleGroup.toLowerCase().replace('_', ' ')}</p>
                  </div>
                  <div className="flex gap-6 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">{ex.sets}</span> series
                    </div>
                    <div>
                      <span className="font-medium">{ex.reps}</span> reps
                    </div>
                    <div>
                      <span className="font-medium">{ex.restSeconds}s</span> descanso
                    </div>
                  </div>
                  {ex.notes && (
                    <div className="text-sm text-gray-500 italic max-w-xs">
                      {ex.notes}
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
