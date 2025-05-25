'use server'
import prisma from "@/lib/prisma"; // Assuming you are using Prisma ORM, change if you're using a different ORM
import getUserId from "../user/getUserId";
import { Team } from "@/lib/types";

export interface TeamMemberUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  user: TeamMemberUser;
}

export interface MyTeam {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  leaderId: string,
  leader?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  members: TeamMember[];
  projects: any[];
}

export async function getMyTeams(): Promise<{
    teams?: MyTeam[], error?: string
}> {

  try {
    const { id, error } = await getUserId();
    if(!id || error) {
        return { error : "User Not Found" };
    }
    const userTeams = await prisma.team.findMany({
      where: {
        members: {
          some: {
            userId: id,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        projects: {
          
        },
      },
    });

    const formattedTeams: MyTeam[] = userTeams.map(team => ({
      ...team,
      createdAt: team.createdAt.toISOString(),
    }));

    // console.log(formattedTeams);
    
    return { teams: formattedTeams }
  } catch (error) {
    console.error("Failed to fetch teams:", error);
    return { error: "Failed to fetch teams" };
  }
}