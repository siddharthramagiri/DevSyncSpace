import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import getUserId from '@/app/api/user/getUserId';

export async function GET(
  req: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const {id, error} = await getUserId();
    if(!id || error) {
        return NextResponse.json({ error: 'Session or Server Error' }, { status: 500 });
    }

    // Verify user is member of team
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        teamId: params.teamId,
        userId: id
      }
    });

    const team = await prisma.team.findFirst({
      where: {
        id: params.teamId,
        leaderId: id
      }
    });

    if (!teamMember && !team) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const members = await prisma.teamMember.findMany({
      where: {
        teamId: params.teamId
      },
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
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
