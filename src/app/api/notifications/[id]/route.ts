import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notification = await prisma.notification.findUnique({
      where: { id: params.id },
      include: { member: true },
    });

    if (!notification) {
      return NextResponse.json({ error: 'Notificación no encontrada' }, { status: 404 });
    }

    return NextResponse.json(notification);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener notificación' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const notification = await prisma.notification.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(notification);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar notificación' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.notification.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Notificación eliminada' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar notificación' }, { status: 500 });
  }
}
