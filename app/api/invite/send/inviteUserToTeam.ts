'use server';
import prisma from "@/lib/prisma";
import getUser from "../../user/getUser";
import { getUserById } from "../../user/getUser";
import { InviteStatus } from "@/lib/types";

export async function inviteUserToTeams(teamId: string, inviteToId: string): 
Promise<{ message?: string; error?: string }> {
  try {
    // Get current user (inviter)
    const currUser = await getUser();
    if (!currUser.user || currUser.error) {
      return { error: "Authorization Error" };
    }

    const inviterId = currUser.user.id;

    // Check if invitee exists
    const { user: invitee, error: inviteeError } = await getUserById(inviteToId);
    if (!invitee || inviteeError) {
      return { error: "User not found" };
    }

    // Check for existing invitation (regardless of status)
    const existingInvite = await prisma.teamInvitation.findUnique({
      where: {
        teamId_invitedTo: {
          teamId,
          invitedTo: inviteToId,
        },
      },
    });

    if (existingInvite) {
      if (existingInvite.status === InviteStatus.PENDING) {
        return { message: "An invitation is already pending for this user." };
      }

      // Re-send the invitation by updating the status
      await prisma.teamInvitation.update({
        where: {
          teamId_invitedTo: {
            teamId,
            invitedTo: inviteToId,
          },
        },
        data: {
          status: InviteStatus.PENDING,
          invitedBy: inviterId,
          createdAt: new Date().toISOString(),
        },
      });

      return { message: `Re-invitation sent to ${invitee.email}` };
    }

    // Create new invitation
    await prisma.teamInvitation.create({
      data: {
        teamId,
        invitedBy: inviterId,
        invitedTo: inviteToId,
        status: InviteStatus.PENDING,
        createdAt: new Date().toISOString(),
      },
    });

    return { message: `Invitation sent to ${invitee.email}` };
  } catch (error) {
    console.error("Error sending invite:", error);
    return { error: "Error sending invite" };
  }
}
