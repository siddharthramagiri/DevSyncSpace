'use client';

import { useEffect, useState } from "react";
import getUser from "@/app/api/user/getUser";
import { FC } from "react";
import { User, TeamMember, Project } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const { user, error } = await getUser();
      if (!user || error) {
        toast({
          title: "Error",
          description: `Error fetching User: ${error}`,
        });
        return;
      }
      setUser(user);
    };
    fetchData();
  }, []);

  if (!user) return <div className="p-6 text-gray-500 text-center">Loading...</div>;

  return <ProfileDetails user={user} />;
}

interface ProfileDetailsProps {
  user: User;
}

const ProfileDetails: FC<ProfileDetailsProps> = ({ user }) => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Profile</h1>

      {/* Profile Image and Info */}
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

      {/* User Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-gray-700">
        <div><span className="font-medium">User ID:</span> {user.id}</div>
        <div><span className="font-medium">Joined On:</span> {new Date(user.createdAt).toLocaleDateString()}</div>
      </div>

      {/* Teams Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Teams</h2>
        {user.teams?.length ? (
          <ul className="space-y-6">
            {user.teams.map((teamMember: TeamMember) => {
              const team = teamMember.team;
              if (!team) return null;
              return (
                <li key={team.id} className="border border-gray-200 p-4 rounded-md hover:shadow-sm transition">
                  <div className="text-lg font-medium text-gray-800">{team.name}</div>

                  {/* Projects under each team */}
                  <div className="mt-3">
                    <span className="text-sm font-semibold text-gray-600">Projects:</span>
                    {team.projects?.length ? (
                      <ul className="mt-1 list-disc list-inside text-gray-700 text-sm">
                        {team.projects.map((project: Project) => (
                          <li key={project.id}>{project.title}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 mt-1">No projects available for this team</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-500">No teams found</p>
        )}
      </div>
    </div>
  );
};
