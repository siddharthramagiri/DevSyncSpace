'use server'
import prisma from "@/lib/prisma";
import getUserId from "../user/getUserId";
import { MyTeam } from "./getMyTeams"; // reuse interfaces

export async function getAllTeams(): Promise<{
  teams?: MyTeam[], error?: string
}> {
  try {
    const { id, error } = await getUserId();
    if (!id || error) {
      return { error: "User Not Found" };
    }

    const allOtherTeams = await prisma.team.findMany({
      where: {
        members: {
          none: {
            userId: id,
          },
        },
      },
      include: {
        leader: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
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
        projects: {},
      },
    });

    const formattedTeams: MyTeam[] = allOtherTeams.map(team => ({
      ...team,
      createdAt: team.createdAt.toISOString(),
    }));

    return { teams: formattedTeams };
  } catch (error) {
    console.error("Failed to fetch all other teams:", error);
    return { error: "Failed to fetch all other teams" };
  }
}
