import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { UserPlus } from 'lucide-react'

export default function MembersPage() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Miembros</h1>
          <Link href="/members/new">
            <Button><UserPlus className="w-4 h-4 mr-2" />Nuevo miembro</Button>
          </Link>
        </div>
        <Card className="p-6">
          <p className="text-muted-foreground">Lista de miembros...</p>
        </Card>
      </div>
    </main>
  )
}
