import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth';
import getUser from '../user/getUser';
import getUserId from '../user/getUserId';

export async function GET(req: NextRequest) {
  try {

    const {id, error} = await getUserId();
    if(!id || error) {
        throw new Error("Error");
    }

    const chats = await prisma.chat.findMany({
      where: {
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
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
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
        },
        team: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const {id, error} = await getUserId();
    if(!id || error) {
        throw new Error("Error");
    }

    const body = await req.json();
    const { name, isGroup, teamId, memberIds } = body;

    // Create chat
    const chat = await prisma.chat.create({
      data: {
        name,
        isGroup,
        teamId,
        members: {
          create: [
            { userId: id },
            ...memberIds.map((userId: string) => ({ userId }))
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
        },
        team: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json(chat);
  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}