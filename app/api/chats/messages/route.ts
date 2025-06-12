'use server'

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function POST(req: Request) {
  const { chatId, content, senderId } = await req.json();
  if (!chatId || !content || !senderId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const msg = await prisma.message.create({
    data: { chatId, content, senderId },
    include: { sender: true },
  });

  return NextResponse.json(msg);
}
