import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import getUserId from '@/app/api/user/getUserId';

export async function GET(
  req: NextRequest,
  context: { params: { teamId: string } }
) {
  const { teamId } = context.params;

  try {
    const { id, error } = await getUserId();
    if (!id || error) {
      return NextResponse.json({ error: 'Session or Server Error' }, { status: 500 });
    }

    // Verify user is member of team or team leader
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: id
      }
    });

    const team = await prisma.team.findFirst({
      where: {
        id: teamId,
        leaderId: id
      }
    });

    if (!teamMember && !team) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const members = await prisma.teamMember.findMany({
      where: {
        teamId
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
