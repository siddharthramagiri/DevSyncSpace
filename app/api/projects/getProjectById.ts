import prisma from "@/lib/prisma";
import { Project } from "@/lib/types";

export default async function  getProjectById(id : string) : 
Promise<{ project?: Project, error?: string }>
{
    try {
        const project = await prisma.project.findUnique({
            where : {
                id : id,
            },
        })
        
        const currProject: Project = {
            ...project,
            id: id,
            title : project?.title as string,
            description : project?.description || undefined,
            githubUrl : project?.githubUrl || undefined,
            teamId: project?.teamId as string,
        }

        return { project : currProject };
    } catch (error) {
        return { error : "Error Geting the Project Details" };
    }
    return {};
}