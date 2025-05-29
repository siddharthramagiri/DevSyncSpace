'use server'

import prisma from "@/lib/prisma"
import { User } from "@/lib/types"

export default async function getAllUserstoInvite(teamId: string): 
Promise<{ users?: User[], error?: string }> {
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

        const users: User[] = availableUsers.map(user => ({
            ...user,
            name: user.name ?? undefined,
            createdAt: user.createdAt.toISOString(),
        }));

        return { users };
    } catch (error) {
        return { error: "Error Fetching the Users" };
    }
}
