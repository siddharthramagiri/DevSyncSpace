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
