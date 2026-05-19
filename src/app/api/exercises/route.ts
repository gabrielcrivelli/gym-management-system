import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const equipmentId = searchParams.get('equipmentId')
    const muscleGroup = searchParams.get('muscleGroup')
    
    const exercises = await db.exercise.findMany({
      where: {
        ...(equipmentId && { equipmentId }),
        ...(muscleGroup && { muscleGroup: muscleGroup as any }),
        active: true,
      },
      orderBy: { name: 'asc' },
      include: { equipment: true },
    })
    return NextResponse.json(exercises)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching exercises' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const exercise = await db.exercise.create({ data: body })
    return NextResponse.json(exercise, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error creating exercise' }, { status: 500 })
  }
}
