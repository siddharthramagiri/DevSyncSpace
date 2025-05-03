'use server'
import prisma from "@/lib/prisma"; // Assuming you are using Prisma ORM, change if you're using a different ORM
import getUserId from "../user/getUserId";
import { Team } from "@/lib/types";

export async function getAllTeams(): Promise<{
    teams?: Team[], error?: string
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
            userId: id, // Assuming you have a UserTeams relationship
          },
        },
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        leaderId: true,
      },
    });

    const formattedTeams: Team[] = userTeams.map(team => ({
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