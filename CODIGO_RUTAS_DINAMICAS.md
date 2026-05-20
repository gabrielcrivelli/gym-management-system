# Código para Rutas Dinámicas y Mejoras del Sistema

## PASO 1: Crear carpeta API con corchetes

**IMPORTANTE**: GitHub no permite crear carpetas con corchetes desde la interfaz web.
**Debes crear esto localmente o usando la terminal de Vercel.**

### Opción A: Terminal Local
```bash
cd gym-management-system
mkdir -p "src/app/api/routines/[id]"
```

### Opción B: Crear archivo desde VS Code
1. Abrir proyecto en VS Code
2. Crear carpeta: `src/app/api/routines/[id]`
3. Crear archivo dentro: `route.ts`

---

## CÓDIGO: src/app/api/routines/[id]/route.ts

```typescript
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const routine = await db.routine.findUnique({
      where: { id: params.id },
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { assignments: true },
        },
      },
    })

    if (!routine) {
      return NextResponse.json({ error: 'Rutina no encontrada' }, { status: 404 })
    }

    return NextResponse.json(routine)
  } catch (error) {
    console.error('Error fetching routine:', error)
    return NextResponse.json({ error: 'Error al obtener rutina' }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { name, description, objective, durationWeeks, active, exercises } = body

    const routine = await db.routine.update({
      where: { id: params.id },
      data: {
        name,
        description: description || null,
        objective: objective || null,
        durationWeeks: durationWeeks || null,
        active: active !== undefined ? active : true,
      },
    })

    // Si se actualizan ejercicios, eliminar los viejos y crear los nuevos
    if (exercises && Array.isArray(exercises)) {
      await db.routineExercise.deleteMany({
        where: { routineId: params.id },
      })

      if (exercises.length > 0) {
        const routineExercises = exercises.map((ex: any, index: number) => ({
          routineId: routine.id,
          exerciseId: ex.exerciseId || ex.id,
          sets: ex.sets || 3,
          reps: ex.reps || '10',
          restSeconds: ex.restSeconds || 60,
          notes: ex.notes || null,
          order: ex.order !== undefined ? ex.order : index,
        }))

        await db.routineExercise.createMany({
          data: routineExercises,
        })
      }
    }

    const updatedRoutine = await db.routine.findUnique({
      where: { id: params.id },
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' },
        },
      },
    })

    return NextResponse.json(updatedRoutine)
  } catch (error) {
    console.error('Error updating routine:', error)
    return NextResponse.json({ error: 'Error al actualizar rutina' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.routine.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting routine:', error)
    return NextResponse.json({ error: 'Error al eliminar rutina' }, { status: 500 })
  }
}
```

---

## PASO 2: Crear página de edición

### CÓDIGO: src/app/routines/[id]/edit/page.tsx

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, X } from 'lucide-react'

interface Exercise {
  id: string
  name: string
  muscleGroup: string
}

interface RoutineExercise {
  id?: string
  exerciseId: string
  sets: number
  reps: string
  restSeconds: number
  notes?: string
  order: number
  exercise?: Exercise
}

interface Routine {
  id: string
  name: string
  description?: string
  objective?: string
  durationWeeks?: number
  active: boolean
  exercises: RoutineExercise[]
}

export default function EditRoutinePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [routine, setRoutine] = useState<Routine | null>(null)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [objective, setObjective] = useState('')
  const [durationWeeks, setDurationWeeks] = useState<number | ''>('')
  const [active, setActive] = useState(true)
  const [routineExercises, setRoutineExercises] = useState<RoutineExercise[]>([])

  useEffect(() => {
    fetchData()
  }, [params.id])

  const fetchData = async () => {
    try {
      const [routineRes, exercisesRes] = await Promise.all([
        fetch(`/api/routines/${params.id}`),
        fetch('/api/exercises')
      ])

      if (routineRes.ok) {
        const routineData = await routineRes.json()
        setRoutine(routineData)
        setName(routineData.name)
        setDescription(routineData.description || '')
        setObjective(routineData.objective || '')
        setDurationWeeks(routineData.durationWeeks || '')
        setActive(routineData.active)
        setRoutineExercises(routineData.exercises || [])
      }

      if (exercisesRes.ok) {
        const exercisesData = await exercisesRes.json()
        setExercises(exercisesData)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch(`/api/routines/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          objective,
          durationWeeks: durationWeeks || null,
          active,
          exercises: routineExercises.map((ex, index) => ({
            exerciseId: ex.exerciseId,
            sets: ex.sets,
            reps: ex.reps,
            restSeconds: ex.restSeconds,
            notes: ex.notes,
            order: index,
          }))
        }),
      })

      if (res.ok) {
        router.push(`/routines/${params.id}`)
      } else {
        alert('Error al actualizar la rutina')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al actualizar la rutina')
    } finally {
      setSaving(false)
    }
  }

  const addExercise = () => {
    setRoutineExercises([...routineExercises, {
      exerciseId: '',
      sets: 3,
      reps: '10',
      restSeconds: 60,
      notes: '',
      order: routineExercises.length,
    }])
  }

  const removeExercise = (index: number) => {
    setRoutineExercises(routineExercises.filter((_, i) => i !== index))
  }

  const updateExercise = (index: number, field: keyof RoutineExercise, value: any) => {
    const updated = [...routineExercises]
    updated[index] = { ...updated[index], [field]: value }
    setRoutineExercises(updated)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Editar Rutina</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Información Básica</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objetivo
              </label>
              <input
                type="text"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración (semanas)
              </label>
              <input
                type="number"
                value={durationWeeks}
                onChange={(e) => setDurationWeeks(e.target.value ? parseInt(e.target.value) : '')}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="active" className="text-sm font-medium text-gray-700">
              Rutina activa
            </label>
          </div>
        </div>

        {/* Ejercicios */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Ejercicios</h2>
            <button
              type="button"
              onClick={addExercise}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Agregar Ejercicio
            </button>
          </div>

          <div className="space-y-4">
            {routineExercises.map((ex, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Ejercicio {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeExercise(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ejercicio *
                    </label>
                    <select
                      value={ex.exerciseId}
                      onChange={(e) => updateExercise(index, 'exerciseId', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecciona un ejercicio...</option>
                      {exercises.map((exercise) => (
                        <option key={exercise.id} value={exercise.id}>
                          {exercise.name} - {exercise.muscleGroup}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Series
                    </label>
                    <input
                      type="number"
                      value={ex.sets}
                      onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                      min="1"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Repeticiones
                    </label>
                    <input
                      type="text"
                      value={ex.reps}
                      onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descanso (seg)
                    </label>
                    <input
                      type="number"
                      value={ex.restSeconds}
                      onChange={(e) => updateExercise(index, 'restSeconds', parseInt(e.target.value))}
                      min="0"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notas
                    </label>
                    <input
                      type="text"
                      value={ex.notes || ''}
                      onChange={(e) => updateExercise(index, 'notes', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {routineExercises.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No hay ejercicios. Haz clic en "Agregar Ejercicio" para comenzar.
            </p>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  )
}
```

---

## RESUMEN DE ARCHIVOS A CREAR

1. ✅ `src/app/routines/[id]/page.tsx` - YA CREADO
2. ⚠️ `src/app/api/routines/[id]/route.ts` - CREAR MANUALMENTE (código arriba)
3. 📝 `src/app/routines/[id]/edit/page.tsx` - CREAR CON CÓDIGO ARRIBA

---

## INSTRUCCIONES RÁPIDAS

1. Copia el código de `route.ts` y créalo en `src/app/api/routines/[id]/route.ts`
2. Copia el código de `edit/page.tsx` y créalo en `src/app/routines/[id]/edit/page.tsx`  
3. Haz commit y push
4. Vercel desplegará automáticamente
5. Prueba haciendo clic en una rutina

---

**Fecha**: 20 de mayo 2026
**Versión**: 1.0
