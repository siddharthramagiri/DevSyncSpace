'use server'
import { InviteStatus } from "@prisma/client";
import getUser from "../../user/getUser";
import prisma from "@/lib/prisma";

export async function acceptInvitation(inviteId: string, teamId: string) {
  try {
    const { user } = await getUser();
    if (!user) return { error: "Unauthorized" };

    // Mark invitation as accepted
    await prisma.teamInvitation.update({
      where: { id: inviteId },
      data: { status: InviteStatus.ACCEPTED },
    });

    // Add to TeamMember table
    await prisma.teamMember.create({
      data: {
        userId: user.id,
        teamId,
      },
    });

    return { message: "Joined the team successfully" };
  } catch (error) {
    return { error: "Failed to accept invitation" };
  }
}
