// pages/api/invite/accept.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { projectId, userId } = await req.json();

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || !project.teamId) {
    return NextResponse.json({ error: 'Invalid project' }, { status: 400 });
  }

  const alreadyMember = await prisma.teamMember.findFirst({
    where: { userId, teamId: project.teamId },
  });

  if (alreadyMember) {
    return NextResponse.json({ message: 'Already a member' }, { status: 200 });
  }

  await prisma.teamMember.create({
    data: {
      userId,
      teamId: project.teamId,
    },
  });

  return NextResponse.json({ message: 'User added to team' });
}
