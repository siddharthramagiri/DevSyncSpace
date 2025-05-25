'use server'

import prisma from "@/lib/prisma"
import { User } from "@/lib/types"

export default async function getAllUsers(id: string) : 
Promise<{users ?: User[], error? : string}> {
    try {
        const existingMembers = await prisma.teamMember.findMany({
        where: { id },
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
            name: user.name === null ? undefined : user.name,
            createdAt: user.createdAt.toISOString(),
        }))

        return {users};
    } catch (error) {
        return {error : "Error Fetching the Users"};
    }
} 