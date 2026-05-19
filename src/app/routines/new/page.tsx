'use client';
// Página para crear nuevas rutinas de entrenamiento

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewRoutinePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    difficulty: 'INTERMEDIATE',
    duration: 60,
    isActive: true,
  });
  const [exercises, setExercises] = useState<any[]>([]);
  const [availableExercises, setAvailableExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [exerciseConfig, setExerciseConfig] = useState({
    sets: 3,
    reps: 10,
    restSeconds: 60,
    notes: '',
  });

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await fetch('/api/exercises');
      const data = await response.json();
      setAvailableExercises(data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const addExerciseToRoutine = () => {
    if (!selectedExercise) return;
    
    const exercise = availableExercises.find(e => e.id === selectedExercise);
    if (!exercise) return;

    setExercises([...exercises, {
      exerciseId: exercise.id,
      exercise: exercise,
      order: exercises.length,
      ...exerciseConfig,
    }]);

    setSelectedExercise('');
    setExerciseConfig({ sets: 3, reps: 10, restSeconds: 60, notes: '' });
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Crear la rutina
      const routineResponse = await fetch('/api/routines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!routineResponse.ok) throw new Error('Error al crear rutina');
      
      const routine = await routineResponse.json();

      // Agregar ejercicios a la rutina
      for (const exercise of exercises) {
        await fetch(`/api/routines/${routine.id}/exercises`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            exerciseId: exercise.exerciseId,
            sets: exercise.sets,
            reps: exercise.reps,
            restSeconds: exercise.restSeconds,
            notes: exercise.notes,
            order: exercise.order,
          }),
        });
      }

      router.push('/routines');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear la rutina');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Nueva Rutina</h1>
        <p className="text-gray-600">Crea una nueva rutina de entrenamiento</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Información Básica</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">Nombre *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Rutina de Fuerza"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Descripción</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Describe los objetivos de esta rutina"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Dificultad</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="BEGINNER">Principiante</option>
                <option value="INTERMEDIATE">Intermedio</option>
                <option value="ADVANCED">Avanzado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Duración (min)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="mr-2 w-4 h-4"
                />
                <span className="text-sm font-medium">Rutina activa</span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Ejercicios</h2>

          <div className="border-2 border-dashed rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Seleccionar Ejercicio</label>
                <select
                  value={selectedExercise}
                  onChange={(e) => setSelectedExercise(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Selecciona un ejercicio...</option>
                  {availableExercises.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name} - {ex.category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1">Series</label>
                  <input
                    type="number"
                    value={exerciseConfig.sets}
                    onChange={(e) => setExerciseConfig({ ...exerciseConfig, sets: parseInt(e.target.value) })}
                    className="w-full px-2 py-2 border rounded text-sm"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Reps</label>
                  <input
                    type="number"
                    value={exerciseConfig.reps}
                    onChange={(e) => setExerciseConfig({ ...exerciseConfig, reps: parseInt(e.target.value) })}
                    className="w-full px-2 py-2 border rounded text-sm"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Descanso (s)</label>
                  <input
                    type="number"
                    value={exerciseConfig.restSeconds}
                    onChange={(e) => setExerciseConfig({ ...exerciseConfig, restSeconds: parseInt(e.target.value) })}
                    className="w-full px-2 py-2 border rounded text-sm"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={addExerciseToRoutine}
              disabled={!selectedExercise}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              + Agregar Ejercicio
            </button>
          </div>

          {exercises.length > 0 && (
            <div className="space-y-2 mt-4">
              <h3 className="font-medium text-sm text-gray-700">Ejercicios agregados ({exercises.length})</h3>
              {exercises.map((ex, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{ex.exercise.name}</p>
                    <p className="text-sm text-gray-600">
                      {ex.sets} series × {ex.reps} reps | Descanso: {ex.restSeconds}s
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExercise(index)}
                    className="text-red-600 hover:text-red-800 px-3 py-1"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.push('/routines')}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || !formData.name || exercises.length === 0}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Creando...' : 'Crear Rutina'}
          </button>
        </div>
      </form>
    </div>
  );
}
