'use server'

import prisma from "@/lib/prisma"; // adjust path to your prisma client
import { getUserById } from "../user/getUser";
import { User } from "@/lib/types";

export async function updateTeamDetails(teamId : string, name : string) :
Promise<{ message?: string, error?: string }> {
  try {
    const team = await prisma.team.update({
      where: { id: teamId },
      data: { name : name },
    });

    return { message : "Updated Team Details"};
  } catch (error) {
    return {error : "Something went Wrong"};
  }
}

export async function removeTeamMember(teamId: string, userId: string) :
Promise<{message?: string, error?: string}> {
    try {
      await prisma.teamMember.deleteMany({
        where: {
          teamId: teamId,
          userId: userId,
        },
      });

      await prisma.teamInvitation.deleteMany({
        where: {
          teamId,
          invitedTo: userId,
          status: "ACCEPTED",
        },
      });

      const {user : User} = await getUserById(userId);

      return { message : `Removed ${User?.name} from the Team`};
    } catch (error) {
      return {error : "Something went Wrong"};
    }
}