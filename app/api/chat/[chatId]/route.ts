// app/api/chat/[chatId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import getUserId from '../../user/getUserId';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ chatId: string }> }
) {
  try {
    
    const {id, error} = await getUserId();
    if(!id || error) {
        throw new Error("Error");
    }

    const { chatId } = await context.params;

    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        members: {
          some: {
            userId: id
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        },
        team: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    return NextResponse.json(chat);
  } catch (error) {
    console.error('Error fetching chat:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}