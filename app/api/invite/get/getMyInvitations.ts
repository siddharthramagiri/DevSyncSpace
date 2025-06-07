'use server';

import prisma from "@/lib/prisma";
import getUser from "../../user/getUser";
import { TeamInvitation } from "@/lib/types";
import { InviteStatus } from "@/lib/types";

export async function getMyInvitations() {
  try {
    const { user, error } = await getUser();
    if (!user || error) {
      return { invitations: null, error: "Unauthorized" };
    }

    const prismaInvitations = await prisma.teamInvitation.findMany({
      where: {
        invitedTo: user.id,
        status: InviteStatus.PENDING,
      },
      include: {
        team: true,
        inviter: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const invitations: TeamInvitation[] = prismaInvitations.map(invite => ({
      ...invite,
      createdAt: invite.createdAt.toISOString(),
      team: {
        ...invite.team,
        createdAt: invite.team.createdAt.toISOString(),
      },
      inviter: {
        ...invite.inviter,
        createdAt: invite.inviter.createdAt.toISOString(),
        name: invite.inviter.name === null ? undefined : invite.inviter.name,
        image: invite.inviter.image === null ? undefined : invite.inviter.image,
      },
      status: invite.status as InviteStatus,
    }));
    
    // console.log(invitations);

    return { invitations };
  } catch (err) {
    console.error(err);
    return { invitations: null, error: "Failed to fetch invitations" };
  }
}
