import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const equipment = await db.equipment.findUnique({
      where: { id: params.id },
      include: { exercises: true },
    })
    if (!equipment) {
      return NextResponse.json({ error: 'Equipment not found' }, { status: 404 })
    }
    return NextResponse.json(equipment)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching equipment' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const equipment = await db.equipment.update({
      where: { id: params.id },
      data: body,
    })
    return NextResponse.json(equipment)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error updating equipment' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await db.equipment.delete({ where: { id: params.id } })
    return NextResponse.json({ message: 'Equipment deleted' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error deleting equipment' }, { status: 500 })
  }
}
