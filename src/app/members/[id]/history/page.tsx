'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, CheckCircle, Circle } from 'lucide-react'

export default function MemberHistoryPage({ params }: { params: { id: string } }) {
  const [sessions, setSessions] = useState<any[]>([])
  const [memberName, setMemberName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { fetchData() }, [params.id])

  const fetchData = async () => {
    try {
      const memberRes = await fetch(`/api/members/${params.id}`)
      if (!memberRes.ok) throw new Error('Error al cargar miembro')
      const memberData = await memberRes.json()
      setMemberName(memberData.name)

      const historyRes = await fetch(`/api/members/${params.id}/training-history`)
      if (!historyRes.ok) throw new Error('Error al cargar historial')
      const historyData = await historyRes.json()
      
      const allSessions = historyData.flatMap((mr: any) => 
        mr.sessions.map((s: any) => ({ ...s, memberRoutine: { routine: mr.routine } }))
      )
      allSessions.sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime())
      setSessions(allSessions)
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="text-lg">Cargando historial...</div></div>
  if (error) return <div className="container mx-auto px-4 py-8"><div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div></div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/members/${params.id}`} className="text-blue-600 hover:text-blue-700">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Historial de Entrenamientos</h1>
          <p className="text-gray-600">{memberName}</p>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center"><p className="text-gray-500">No hay sesiones de entrenamiento registradas</p></div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session: any) => (
            <div key={session.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{session.memberRoutine.routine.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(session.sessionDate).toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${session.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {session.completed ? <><CheckCircle className="w-4 h-4" /> Completada</> : <><Circle className="w-4 h-4" /> En progreso</>}
                </span>
              </div>

              {session.exerciseLogs && session.exerciseLogs.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Ejercicios realizados:</h4>
                  <div className="space-y-3">
                    {Object.entries(
                      session.exerciseLogs.reduce((acc: any, log: any) => {
                        const name = log.exercise.name
                        if (!acc[name]) acc[name] = []
                        acc[name].push(log)
                        return acc
                      }, {})
                    ).map(([exerciseName, logs]: [string, any]) => (
                      <div key={exerciseName} className="bg-gray-50 rounded-lg p-3">
                        <div className="font-medium mb-2">{exerciseName}</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                          {logs.map((log: any) => (
                            <div key={log.id} className="flex items-center gap-2">
                              <span className="text-gray-600">Set {log.setNumber}:</span>
                              <span className="font-medium">
                                {log.reps ? `${log.reps} reps` : '-'}
                                {log.weight && ` × ${log.weight}${log.weightUnit}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
