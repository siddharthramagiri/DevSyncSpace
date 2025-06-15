'use server'

import prisma from "@/lib/prisma";
import { TeamMember } from "@/lib/types";
import getUserId from "../user/getUserId";


export async function getTeamMembersForUser() : 
Promise<TeamMember[]> {

    const { id, error } = await getUserId();
    if(!id || error) {
        return [];
    }

    const userId = id;

  const teams = await prisma.teamMember.findMany({
    where: { userId },
    include: {
      team: {
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  const allMembers: TeamMember[] = [];

  teams.forEach((tm) => {
      tm.team?.members?.forEach((member) => {
        if (!allMembers.find((m) => m.userId === member.userId)) {
          // Convert user.name and user.image nulls to undefined if needed
          allMembers.push({
            ...member,
            user: {
              ...member.user,
              name: member.user.name === null ? undefined : member.user.name,
              image: member.user.image === null ? undefined : member.user.image,
              createdAt: member.user.createdAt instanceof Date
                ? member.user.createdAt.toISOString()
                : member.user.createdAt,
            },
          });
        }
      });
    });

  return allMembers;
}
