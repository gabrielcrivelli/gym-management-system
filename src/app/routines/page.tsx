'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Dumbbell, Plus } from 'lucide-react';

interface Routine {
  id: string
  name: string
  description?: string
  objective?: string
  exercises: { id: string }[]
  _count: { assignments: number }
}

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/routines');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setRoutines(data);
    } catch (err) {
      console.error('Error fetching routines:', err);
      setError('Error al cargar las rutinas. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando rutinas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error al cargar rutinas</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchRoutines}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Dumbbell className="w-8 h-8 text-orange-600" />
            Rutinas de Entrenamiento
          </h1>
          <p className="text-gray-600 mt-2">Gestiona las rutinas de ejercicios para tus miembros</p>
        </div>
        <Link
          href="/routines/new"
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Rutina
        </Link>
      </div>

      {routines.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Dumbbell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay rutinas creadas</h3>
          <p className="text-gray-500 mb-6">Comienza creando tu primera rutina de entrenamiento</p>
          <Link
            href="/routines/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Crear Primera Rutina
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routines.map((routine) => (
            <Link
              key={routine.id}
              href={`/routines/${routine.id}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {routine.name}
                  </h3>
                  {routine.description && (
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{routine.description}</p>
                  )}
                </div>
                <Dumbbell className="w-6 h-6 text-orange-600 flex-shrink-0" />
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
                <span>{routine.exercises?.length || 0} ejercicios</span>
                <span>{routine._count?.assignments || 0} asignaciones</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
