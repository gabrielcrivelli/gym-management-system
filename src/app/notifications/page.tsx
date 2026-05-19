import { Card } from '@/components/ui/card'

export default function NotificationsPage() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Notificaciones</h1>
        <Card className="p-6">
          <p className="text-muted-foreground">Configuración de notificaciones...</p>
        </Card>
      </div>
    </main>
  )
}
