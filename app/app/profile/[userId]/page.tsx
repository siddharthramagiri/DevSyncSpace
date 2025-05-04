'use client';

import { useEffect, useState, FC } from "react";
import { useParams } from "next/navigation";
import { getUserById } from "@/app/api/user/getUser";
// import { getAllProjects } from "@/app/api/projects/getAllProjects";
import { getUserProjects } from "@/app/api/projects";
import getUserId from "@/app/api/user/getUserId";
import { User, Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import InviteModal from "@/components/InviteModal";
import { useToast } from "@/hooks/use-toast";


export default function UserProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const { toast } = useToast();
  const params = useParams();
  const userId = params?.userId as string;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { user, error } = await getUserById(userId);
        if(!user || error) {
          toast({
            title: "Error Loading Id",
            description: "Something went wrong! Please try again Later",
          });
          return;
        }
        setUser(user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    if (userId) fetchUserData();
  }, [userId]);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const { id, error } = await getUserId();
        if(!id || error) {
          toast({
            title: "Error",
            description: "Could'nt Fetch the Projects Data",
          });
          return;
        }
        const { projects } = await getUserProjects(id);
        if(projects)
          setProjects(projects.map(project => ({
            ...project,
            description: project.description ?? undefined,
            githubUrl: project.githubUrl?? undefined,
          })));
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjectData();
  }, []);

  if (!user) return <div className="p-6 text-center text-gray-500">Loading...</div>;
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">{user.name}'s Profile</h1>

      <div className="flex items-center gap-6 mb-8">
        <img
          src={user.image ?? "/default-avatar.png"}
          alt="Profile"
          className="h-24 w-24 rounded-full object-cover shadow-sm"
        />
        <div>
          <p className="text-xl font-semibold text-gray-900">{user.name}</p>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="mb-6">
        <Button onClick={() => setIsInviteModalOpen(true)}>Invite to Project</Button>
      </div>

      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        userId={userId}
        projects={projects}
      />

      {/* User Teams */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Current Teams</h2>
        {user.teams && user.teams.length > 0 ? (
          <ul className="space-y-3">
            {user.teams.map((team) => (
              <li key={team.id} className="border rounded-md p-4 bg-white shadow-sm">
                <p className="font-medium text-lg text-gray-900">{team.team?.name}</p>
                {team.team?.projects && 
                team.team.projects.map((project) => 
                  <p key={project.id} className="text-sm text-gray-500">{project.title}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">This user is not part of any team.</p>
        )}
      </div>
    </div>
  );
}