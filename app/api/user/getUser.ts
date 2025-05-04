'use server'
import prisma from "@/lib/prisma";
import { User } from "@/lib/types";
import getUserId from "./getUserId";


export default async function getUser():
Promise<{ user?: User, error?: string }>
{
    try {
        const {id, error} = await getUserId();
        if(!id || error) {
            return {error : "Not Authenticated"};
        }

        const currUser = await prisma.user.findUnique({
            where : {
              id : id,
            },
            include: {
                teams: {
                    include: {
                    team: {
                        include: {
                            projects: true,
                        }
                    }
                    }
                }
            }
        });

        if(!currUser) {
            return {error : "Not Authenticated!"};
        }

        const user: User = {
            id : currUser.id,
            email : currUser.email,
            name : currUser.name || undefined,
            image : `https://ui-avatars.com/api/?name=${currUser.name}`,
            createdAt : currUser.createdAt.toISOString(),
            teams : currUser.teams.map(teamMember => ({
                ...teamMember,
                team: {
                    ...teamMember.team,
                    createdAt: teamMember.team.createdAt.toISOString(),
                    projects: teamMember.team.projects.map(project => ({
                        ...project,
                        description: project.description ?? undefined,
                        githubUrl: project.githubUrl ?? undefined,
                    })),
                }
            })),
        }

        // console.log(user);
        
        return { user : user};
    } catch (error) {
        return {error : "Error Loading User Details"};
    }

}


export async function getUserById( userId : string ) :
Promise<{ user ?: User, error ?: string }>
{
    try {
        const SearchedUser = await prisma.user.findUnique({
            where : {
              id : userId,
            },
            include: {
                teams: {
                    include: {
                    team: {
                        include: {
                            projects: true,
                        }
                    }
                    }
                }
            }
        });

        if(!SearchedUser) {
            return {error : "Not Authenticated!"};
        }

        const user: User = {
            id : SearchedUser.id,
            email : SearchedUser.email,
            name : SearchedUser.name || undefined,
            image : SearchedUser.image || undefined,
            createdAt : SearchedUser.createdAt.toISOString(),
            teams : SearchedUser.teams.map(teamMember => ({
                ...teamMember,
                team: {
                    ...teamMember.team,
                    createdAt: teamMember.team.createdAt.toISOString(),
                    projects: teamMember.team.projects.map(project => ({
                        ...project,
                        description: project.description ?? undefined,
                        githubUrl: project.githubUrl ?? undefined,
                    })),
                }
            })),
        }

        // console.log(user);
        
        return { user : user};
    } catch (error) {
        return {error : "Error Loading User Details"};
    }
}