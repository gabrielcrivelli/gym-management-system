import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const equipment = await db.equipment.findMany({
      orderBy: { name: 'asc' },
      include: { exercises: true },
    })
    return NextResponse.json(equipment)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching equipment' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const equipment = await db.equipment.create({ data: body })
    return NextResponse.json(equipment, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error creating equipment' }, { status: 500 })
  }
}
