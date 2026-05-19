import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const record = await db.attendance.update({
      where: { id: params.id },
      data: body,
      include: { member: true },
    })
    return NextResponse.json(record)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error updating attendance'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.attendance.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error deleting attendance' }, { status: 500 })
  }
}
