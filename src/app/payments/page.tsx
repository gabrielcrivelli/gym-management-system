import { Card } from '@/components/ui/card'

export default function PaymentsPage() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Pagos</h1>
        <Card className="p-6">
          <p className="text-muted-foreground">Historial de pagos...</p>
        </Card>
      </div>
    </main>
  )
}
