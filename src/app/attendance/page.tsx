import { Card } from '@/components/ui/card'

export default function AttendancePage() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Control de Asistencia</h1>
        <Card className="p-6">
          <p className="text-muted-foreground">Registro de asistencia...</p>
        </Card>
      </div>
    </main>
  )
}
