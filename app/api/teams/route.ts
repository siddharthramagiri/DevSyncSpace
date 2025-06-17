'use server'
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Team } from '@/lib/types';
import getUserId from '../user/getUserId';

export async function POST(req: Request) {
  try {
    const {id, error} = await getUserId();
    if(!id || error) {
        return;
    }

    const { name } = await req.json();

    const team = await prisma.team.create({
      data: {
        name,
        leaderId: id,
        members: {
          create: {
            userId: id,
          },
        },
      },
    });

    const newTeam:Team = {
      ...team,
      createdAt : team.createdAt.toISOString(),
    }

    console.log(newTeam);

    return NextResponse.json(newTeam, { status : 200 });
  } catch (err) {
    console.error('Failed to create team:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function GET(req: Request) {
  try {
    const {id, error} = await getUserId();
    if(!id || error) {
        return NextResponse.json({ error: 'Session or Server Error' }, { status: 500 });
    }

    // Get teams where user is a member or leader
    const teams = await prisma.team.findMany({
      where: {
        OR: [
          {
            leaderId: id
          },
          {
            members: {
              some: {
                userId: id
              }
            }
          }
        ]
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        leaderId: true,
        _count: {
          select: {
            members: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}