'use server'
import prisma from "@/lib/prisma";
import { Project } from "@prisma/client";

export async function getUserProjects(userId: string) : 
Promise<{ projects: Project[], error ?: string }>
{
  
  try {
    const projects = await prisma.project.findMany({
      where: {
        team: {
          members: {
            some: {
              userId: userId, // Filter based on the logged-in user's ID
            }
          }
        }
      },
      include: {
        team: {
          include: {
            members: {
              include: { user: true }  // Include user details for team members
            }
          }
        },
        tasks: true,  // Include related tasks for the project
      }
    });
    
    // Extract all projects from the teams
    // console.log(projects);
    
    return { projects };

  } catch (error) {
    return { projects: [], error : "Error Fetching the projects" };
  }
}
