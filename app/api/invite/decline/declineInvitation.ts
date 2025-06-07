'use server'

import prisma from "@/lib/prisma";
import { InviteStatus } from "@prisma/client";

export async function declineInvitation(inviteId: string) {
  try {
    await prisma.teamInvitation.update({
      where: { id: inviteId },
      data: { status: InviteStatus.DECLINED },
    });
    return { message: "Invitation declined" };
  } catch (error) {
    return { error: "Failed to decline invitation" };
  }
}
