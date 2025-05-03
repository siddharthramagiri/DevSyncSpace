'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
// import InviteModal from "@/components/InviteModal";
// import { api } from "@/lib/api";
import { getUserById } from "@/app/api/user/getUser";

const UserProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const router = useRouter();
  const params = useParams();
  const userId = params?.userId as string;

  useEffect(() => {
    console.log("User ID from query: ", userId);
  }, [userId]);

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          const { user } = await getUserById(userId);
          console.log(user);
          setUser(user);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      };
      fetchUser();
    }
  }, [userId]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // const response = await api.project.getProjects();
        // setProjects(response.data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div>
      {user ? (
        <>
          <h1>{user.name}'s Profile</h1>
          <p>{user.email}</p>
          <Button onClick={() => setIsInviteModalOpen(true)}>Invite to Project</Button>
          {/* <InviteModal
            userId={userId}
            isOpen={isInviteModalOpen}
            onClose={() => setIsInviteModalOpen(false)}
            projects={projects}
          /> */}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserProfile;
