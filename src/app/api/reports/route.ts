import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const [totalMembers, activeMembers, totalPayments, pendingPayments] = await Promise.all([
      db.member.count(),
      db.member.count({ where: { active: true } }),
      db.payment.aggregate({ _sum: { amount: true }, where: { status: 'COMPLETED' } }),
      db.payment.count({ where: { status: 'PENDING' } }),
    ])
    return NextResponse.json({
      totalMembers,
      activeMembers,
      totalRevenue: totalPayments._sum.amount ?? 0,
      pendingPayments,
    })
  } catch {
    return NextResponse.json({ error: 'Error generating report' }, { status: 500 })
  }
}
