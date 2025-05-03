'use server'
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { User } from "@/lib/types";

const SearchRequestSchema = z.object({
  user: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user } = SearchRequestSchema.parse(body);

    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: user,
              // mode: "insensitive", // Removed as it's not supported
            },
          },
          {
            email: {
              contains: user,
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true, // corresponds to avatar in frontend
        createdAt : true,
      },
      take: 10,
    });

    // Map to expected frontend structure: avatar -> image
    const formattedUsers: User[] = users.map(user => ({
      id: user.id,
      name: user.name || "No name",
      email: user.email,
      image: user.image || "https://ui-avatars.com/api/?name=User", // fallback avatar
      createdAt: user.createdAt.toISOString(),
    }));

    return NextResponse.json({ users: formattedUsers }, { status: 200 });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ message: "Failed to search users" }, { status: 500 });
  }
}
