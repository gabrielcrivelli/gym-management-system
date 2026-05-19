import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const member = await db.member.findUnique({ where: { id: params.id } })
    if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(member)
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const member = await db.member.update({ where: { id: params.id }, data: body })
    return NextResponse.json(member)
  } catch {
    return NextResponse.json({ error: 'Error updating member' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await db.member.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error deleting member' }, { status: 500 })
  }
}
