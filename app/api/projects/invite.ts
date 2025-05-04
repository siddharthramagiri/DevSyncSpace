'use server';

import getUser, { getUserById } from "../user/getUser";
import prisma from "@/lib/prisma"; // adjust path
import { sendInvitationEmail } from "@/lib/mail";

export async function inviteUserToProject({
  projectId,
  userId
}: {
  projectId: string;
  userId: string;
}) {

  let currUser = await getUser();
  if(!currUser.user || currUser.error) {
    console.log("Error");
    return;
  }

  const inviterName = currUser.user.name;

  const { user, error } = await getUserById(userId);

  if (!user || error) {
    console.log("No user found");
    return { error: "User not found" };
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { team: true },
  });

  if (!project || !project.teamId) {
    return { error: "Project or team not found" };
  }

  await sendInvitationEmail({
    to: user.email,
    fromName: inviterName || "Inviter from DevSyncSpace",
    projectId,
    userId,
  });

  console.log(`Invitation email sent to ${user.email}`);
  return { success: true };
}
