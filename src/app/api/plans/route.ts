import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const plans = await db.plan.findMany({ where: { active: true } })
    return NextResponse.json(plans)
  } catch {
    return NextResponse.json({ error: 'Error fetching plans' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const plan = await db.plan.create({ data: body })
    return NextResponse.json(plan, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error creating plan' }, { status: 500 })
  }
}
