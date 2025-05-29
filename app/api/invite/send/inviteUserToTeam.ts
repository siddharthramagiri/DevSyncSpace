'use server'
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import prisma from "@/lib/prisma"; // adjust path as needed
import getUser from "../../user/getUser";
import { getUserById } from "../../user/getUser";

export async function inviteUserToTeams(TeamId:string, inViteToId: string): 
Promise<{message?: string, error? : string}> {
  try {
      let currUser = await getUser();
      if(!currUser.user || currUser.error) {
        console.log("Authorization Error");
        return {error : "Authorization Error"};
      }
      const inviterName = currUser.user.name;
    
      const { user, error } = await getUserById(inViteToId);

      if (!user || error) {
        console.log("No user found");
        return { error: "User not found" };
      }

    const invitedByUser = await prisma.user.findUnique({
      where: { email: currUser.user.email },
    });

    if (!invitedByUser) {
      return {error : "Invite User Failed"}
    }

    // Check if invitation already exists
    const existingInvite = await prisma.teamInvitation.findFirst({
      where: {
        id : TeamId,
        invitedTo: inViteToId,
        status: "PENDING",
      },
    });

    // if (existingInvite) {
    //   return NextResponse.json({ message: "An invitation is already pending for this user." }, { status: 409 });
    // }

    // // Create the invitation
    // return NextResponse.json(invitation, { status: 201 });
    return {message : `Invitation Sent to ${user.email}`};
  } catch (error) {
    return {error : "Error sending invite"};
  }
}
