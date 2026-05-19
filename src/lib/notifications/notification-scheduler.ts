import { db } from '@/lib/db'
import { sendEmail } from './email-service'
import { sendWhatsApp } from './whatsapp-service'

export async function checkAndSendNotifications(): Promise<void> {
  const today = new Date()
  const warningDate = new Date(today)
  warningDate.setDate(today.getDate() + 5)

  // Find memberships expiring in 5 days
  const expiringSoon = await db.membership.findMany({
    where: {
      status: 'ACTIVE',
      endDate: {
        gte: today,
        lte: warningDate,
      },
    },
    include: { member: true, plan: true },
  })

  for (const membership of expiringSoon) {
    const { member } = membership
    const message = `Hola ${member.firstName}, tu membresía vence el ${membership.endDate.toLocaleDateString('es-AR')}. Renová para seguir entrenando!`

    if (member.email) {
      await sendEmail({
        to: member.email,
        subject: 'Tu membresía está por vencer',
        text: message,
      }).catch(console.error)
    }

    if (member.phone) {
      await sendWhatsApp({ to: member.phone, message }).catch(console.error)
    }

    await db.notificationLog.create({
      data: {
        type: 'membership_expiry',
        channel: member.email ? 'email' : 'whatsapp',
        recipient: member.email || member.phone || '',
        message,
        status: 'sent',
      },
    })
  }
}
