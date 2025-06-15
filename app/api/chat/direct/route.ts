import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import getUserId from '../../user/getUserId';

export async function POST(req: NextRequest) {
  try {
    const {id, error} = await getUserId();
    if(!id || error) {
        throw new Error("Error");
    }


    const body = await req.json();
    const { userId } = body;

    if (!userId || userId === id) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Check if direct chat already exists
    const existingChat = await prisma.chat.findFirst({
      where: {
        isGroup: false,
        teamId: null,
        members: {
          every: {
            userId: {
              in: [id, userId]
            }
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
        }
      }
    });

    if (existingChat && existingChat.members.length === 2) {
      return NextResponse.json(existingChat);
    }

    // Create new direct chat
    const chat = await prisma.chat.create({
      data: {
        isGroup: false,
        members: {
          create: [
            { userId: id },
            { userId }
          ]
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
        }
      }
    });

    return NextResponse.json(chat);
  } catch (error) {
    console.error('Error creating direct chat:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}