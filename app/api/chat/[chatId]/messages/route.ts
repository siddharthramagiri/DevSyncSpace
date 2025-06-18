// app/api/chat/[chatId]/messages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import getUserId from '@/app/api/user/getUserId';

let prisma : any;

try {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
} catch (error) {
  console.warn('Prisma client not available during build');
}

// GET messages
export async function GET(
  req: NextRequest,
  context: { params: { chatId: string } }
) {
  try {

    if (!prisma) {
      const { PrismaClient } = await import('@prisma/client');
      prisma = new PrismaClient();
    }

    const { id, error } = await getUserId();
    if (!id || error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { chatId } = await context.params;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const chatMember = await prisma.chatMember.findFirst({
      where: { chatId, userId: id }
    });

    if (!chatMember) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: { chatId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    return NextResponse.json(messages.reverse());
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST message
export async function POST(
  req: NextRequest,
  context: { params: { chatId: string } }
) {
  try {
    const { id, error } = await getUserId();
    if (!id || error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { chatId } = await context.params;
    const body = await req.json();
    const { content } = body;

    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json({ error: 'Invalid message content' }, { status: 400 });
    }

    const chatMember = await prisma.chatMember.findFirst({
      where: {
        chatId,
        userId: id
      }
    });

    if (!chatMember) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        chatId,
        senderId: id
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
