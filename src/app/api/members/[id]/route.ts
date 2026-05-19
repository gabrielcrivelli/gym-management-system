import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const member = await db.member.findUnique({
      where: { id: params.id },
      include: {
        memberships: { include: { plan: true }, orderBy: { createdAt: 'desc' } },
        payments: { orderBy: { createdAt: 'desc' } },
        attendance: { orderBy: { checkIn: 'desc' }, take: 50 },
        notifications: { orderBy: { createdAt: 'desc' } },
        memberRoutines: { include: { routine: true }, orderBy: { assignedAt: 'desc' } },
      },
    })
    if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ data: member })
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    // Only allow safe fields
    const { name, email, phone, address, birthDate, active } = body
    const data: Record<string, unknown> = {}
    if (name !== undefined) data.name = name
    if (email !== undefined) data.email = email
    if (phone !== undefined) data.phone = phone
    if (address !== undefined) data.address = address
    if (birthDate !== undefined) data.birthDate = birthDate ? new Date(birthDate) : null
    if (active !== undefined) data.active = active

    const member = await db.member.update({ where: { id: params.id }, data })
    return NextResponse.json({ data: member })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error updating member'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const member = await db.member.update({ where: { id: params.id }, data: body })
    return NextResponse.json(member)
  } catch {
    return NextResponse.json({ error: 'Error updating member' }, { status: 500 })
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.member.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error deleting member' }, { status: 500 })
  }
}
