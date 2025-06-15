'use server'

import prisma from "@/lib/prisma";

export async function getMessagesForChat(chatId: string) {
  try {
    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: true,
      },
    });
    return { messages, error: null };
  } catch (error) {
    console.error("Error fetching messages", error);
    return { messages: null, error: "Failed to fetch messages." };
  }
}
