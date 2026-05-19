import { Card } from '@/components/ui/card'

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Configuración</h1>
        <Card className="p-6">
          <p className="text-muted-foreground">Ajustes del sistema...</p>
        </Card>
      </div>
    </main>
  )
}
