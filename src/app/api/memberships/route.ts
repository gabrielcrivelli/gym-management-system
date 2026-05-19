import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const memberships = await db.membership.findMany({
      include: { member: true, plan: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(memberships)
  } catch {
    return NextResponse.json({ error: 'Error fetching memberships' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const membership = await db.membership.create({ data: body })
    return NextResponse.json(membership, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error creating membership' }, { status: 500 })
  }
}
