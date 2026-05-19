import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const memberId = params.id;

    const notifications = await prisma.notification.findMany({
      where: { memberId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching member notifications:', error);
    return NextResponse.json(
      { error: 'Error al obtener notificaciones del miembro' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const memberId = params.id;
    const body = await request.json();
    const { title, message, type, priority } = body;

    const notification = await prisma.notification.create({
      data: {
        memberId,
        title,
        message,
        type,
        priority: priority || 'NORMAL',
        read: false,
      },
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Error al crear notificación' },
      { status: 500 }
    );
  }
}
