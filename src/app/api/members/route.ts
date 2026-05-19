import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const members = await db.member.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(members)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching members' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const member = await db.member.create({ data: body })
    return NextResponse.json(member, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error creating member' }, { status: 500 })
  }
}
