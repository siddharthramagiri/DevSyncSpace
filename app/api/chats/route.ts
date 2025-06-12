'use server'

import { NextResponse } from 'next/server';
import prisma  from '@/lib/prisma';
import getUser from '../user/getUser';

export async function GET(req: Request) {
    try {

        const {user, error} = await getUser();
        if (!user || error) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }
        
        const userId = user.id;

        const chats = await prisma.chat.findMany({
            where: { members: { some: { userId } } },
            include: {
                members: { include: { user: true } },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1, // last message per chat
                    include: { sender: true },
                },
                team: true
            },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(chats);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
    }
}
