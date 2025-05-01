'use server'
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { error } from "console";
import { User } from "@/lib/types";


export default async function getUserId():
Promise<{id?: string, error?: string}>
{
    try {

        const session = await getServerSession(authConfig);
        if(!session) {
            return {error : "Authentication Failed!"};
        }

        const userEmail = session.user?.email;
        if(!userEmail) {
            return {error : "Email Doesn't Exists!"};
        }
        
        const currUser = await prisma.user.findUnique({
            where : {
              email : userEmail,
            },
        });
        if(!currUser) {
            return {error : "Authentication Failed!"};
        }

        const user: User = {
            id : currUser.id,
            email : currUser.email,
            name : currUser.name || undefined,
            createdAt : currUser.createdAt.toISOString()
        }
        // console.log(user);
        return {id : user.id};

    } catch (error) {

        return {error : "Something went Wrong! Try Logging in Again"};
    }

}