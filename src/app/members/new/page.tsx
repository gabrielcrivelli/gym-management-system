import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function NewMemberPage() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Nuevo Miembro</h1>
        <Card className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input placeholder="Juan" />
            </div>
            <div className="space-y-2">
              <Label>Apellido</Label>
              <Input placeholder="Pérez" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="juan@email.com" />
          </div>
          <div className="space-y-2">
            <Label>Teléfono</Label>
            <Input placeholder="+54 11 1234-5678" />
          </div>
          <Button className="w-full">Guardar miembro</Button>
        </Card>
      </div>
    </main>
  )
}
