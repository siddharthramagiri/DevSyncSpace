'use server'
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteTeam(teamId: string): 
Promise<{message?: string, error?: string}> {
  // Replace with actual API call
  try {
    // Delete team and related entries
    await prisma.team.delete({
      where: {
        id: teamId,
      },
    })
    // Optional: revalidate cache and/or redirect
    return {message : `Deleted ${teamId}`}
  } catch (error) {
    return {error : `Failed to delete team ${teamId}`}
  }
}
