// app/api/chats/[chatId]/messages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import getUserId from '@/app/api/user/getUserId';

export async function GET(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    
    const {id, error} = await getUserId();
    if(!id || error) {
        throw new Error("Error");
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Verify user is member of chat
    const chatMember = await prisma.chatMember.findFirst({
      where: {
        chatId: params.chatId,
        userId: id
      }
    });

    if (!chatMember) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: {
        chatId: params.chatId
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
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    return NextResponse.json(messages.reverse());
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}




export async function POST(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    
    const {id, error} = await getUserId();
    if(!id || error) {
        throw new Error("Error");
    }

    const body = await req.json();
    const { content } = body;

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Message content required' }, { status: 400 });
    }

    // Verify user is member of chat
    const chatMember = await prisma.chatMember.findFirst({
      where: {
        chatId: params.chatId,
        userId: id
      }
    });

    if (!chatMember) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        chatId: params.chatId,
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
