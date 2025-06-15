'use server'

import prisma from "@/lib/prisma";


export async function getUserChats(userId: string) {
  try {
    const chatMemberships = await prisma.chatMember.findMany({
      where: { userId },
      include: {
        chat: {
          include: {
            members: {
              include: {
                user: true,
              },
            },
            messages: {
              orderBy: { createdAt: "asc" },
              take: 1,
              include: {
                sender: true,
              },
            },
            team: true,
          },
        },
      },
    });

    return { chats: chatMemberships.map(cm => cm.chat), error: null };
  } catch (error) {
    console.error("Error fetching chats", error);
    return { chats: null, error: "Failed to fetch chats." };
  }
}
