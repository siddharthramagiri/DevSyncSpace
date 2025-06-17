// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import getUserId from './getUserId';

export async function GET(req: NextRequest) {
  try {
    const {id, error} = await getUserId();
    if(!id || error) {
        return NextResponse.json({ error: 'Session error' }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const teamId = searchParams.get('teamId');

    let whereCondition: any = {
      id: {
        not: id // Exclude current user
      }
    };

    if (search) {
      whereCondition.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          email: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ];
    }

    if (teamId) {
      whereCondition.teams = {
        some: {
          teamId: teamId
        }
      };
    }

    const users = await prisma.user.findMany({
      where: whereCondition,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true
      },
      orderBy: {
        name: 'asc'
      },
      take: 50 // Limit results
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}