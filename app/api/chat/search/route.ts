// app/api/chats/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import getUserId from '../../user/getUserId';

export async function GET(req: NextRequest) {
  try {
    const {id, error} = await getUserId();
    if(!id || error) {
        return NextResponse.json({ error: 'Session or Server Error' }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json({ error: 'Search query required' }, { status: 400 });
    }

    // Search in chat names, team names, and user names
    const chats = await prisma.chat.findMany({
      where: {
        AND: [
          {
            members: {
              some: {
                userId: id
              }
            }
          },
          {
            OR: [
              {
                name: {
                  contains: query
                }
              },
              {
                team: {
                  name: {
                    contains: query
                  }
                }
              },
              {
                members: {
                  some: {
                    user: {
                      OR: [
                        {
                          name: {
                            contains: query,
                          }
                        },
                        {
                          email: {
                            contains: query,
                          }
                        }
                      ]
                    }
                  }
                }
              }
            ]
          }
        ]
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
        },
        _count: {
          select: {
            messages: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20 // Limit results for performance
    });

    return NextResponse.json({
      chats,
      total: chats.length
    });

  } catch (error) {
    console.error('Chat search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}