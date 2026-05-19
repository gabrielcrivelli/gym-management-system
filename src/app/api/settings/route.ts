import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    let settings = await db.gymSettings.findUnique({ where: { id: 'singleton' } })
    if (!settings) {
      settings = await db.gymSettings.create({ data: { id: 'singleton', gymName: 'GymManager' } })
    }
    return NextResponse.json({ data: settings })
  } catch {
    return NextResponse.json({ error: 'Error fetching settings' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const settings = await db.gymSettings.upsert({
      where: { id: 'singleton' },
      update: body,
      create: { id: 'singleton', gymName: 'GymManager', ...body },
    })
    return NextResponse.json({ data: settings })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error updating settings'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
