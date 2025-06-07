'use server'

import prisma from "@/lib/prisma"
import { User, InviteStatus } from "@/lib/types"

export default async function getAllUserstoInvite(teamId: string):
Promise<{ users?: (User & { inviteStatus?: InviteStatus })[], error?: string }> {
  try {
    const existingMembers = await prisma.teamMember.findMany({
      where: { teamId },
      select: { userId: true },
    });
    const memberIds = existingMembers.map((m) => m.userId);

    const availableUsers = await prisma.user.findMany({
      where: {
        id: { notIn: memberIds },
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    const invitations = await prisma.teamInvitation.findMany({
      where: { teamId },
      select: {
        invitedTo: true,
        status: true,
      },
    });

    const statusMap = new Map<string, InviteStatus>();
    invitations.forEach(invite => {
      statusMap.set(invite.invitedTo, invite.status as InviteStatus);
    });

    const users = availableUsers.map(user => ({
      ...user,
      name: user.name ?? undefined,
      createdAt: user.createdAt.toISOString(),
      inviteStatus: statusMap.get(user.id) ?? undefined,
    }));

    return { users };
  } catch (error) {
    return { error: "Error Fetching the Users" };
  }
}
