// app/api/projects/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth';
import getUserId from '../user/getUserId';
import { Project } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authConfig);
    
    const user = session?.user;
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const {id, error} = await getUserId();

    if(!id || error) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { title, description, githubUrl, teamId } = await req.json();

    const project = await prisma.project.create({
      data: {
        title,
        description: description || null,
        githubUrl: githubUrl || null,
        teamId,
      },
    });

    const newProject: Project = {
        ...project,
        description : project.description || undefined,
        githubUrl : project.githubUrl || undefined,
    }

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
