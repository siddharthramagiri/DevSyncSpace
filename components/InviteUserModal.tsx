'use client'

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import getAllUserstoInvite from "@/app/api/invite/send/getAllUserstoInvite";
import { useToast } from "@/hooks/use-toast";
import { MyTeam } from "@/app/api/teams/getMyTeams";
import { inviteUserToTeams } from "@/app/api/invite/send/inviteUserToTeam";
import { User } from "@/lib/types";

interface InviteUser {
  id: string;
  name?: string;
  email: string;
  createdAt: string;
  inviteStatus?: "PENDING" | "DECLINED" | "ACCEPTED";
}

interface InviteUsersModalProps {
  team: MyTeam;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface InviteUser extends User {
  inviteStatus?: "PENDING" | "DECLINED" | "ACCEPTED";
}

export function InviteUsersModal({ team, open, onOpenChange }: InviteUsersModalProps) {
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const [users, setUsers] = useState<InviteUser[]>([]);

  const fetchAllUsers = async (id: string) => {
    try {
      const { users, error } = await getAllUserstoInvite(id);
      if (!users || error) {
        toast({ variant: 'destructive', description: error });
        return;
      }
      setUsers(users);
    } catch (error) {
      toast({ variant: 'destructive', description: "Error Fetching Users" });
    }
  };

  useEffect(() => {
    fetchAllUsers(team.id);
  }, [team.id]);

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleInvite = async (user: InviteUser) => {
    try {
      const { message, error } = await inviteUserToTeams(team.id, user.id);

      if (!message || error) {
        toast({
          title: "Failed to Send Invitation",
          description: error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Invitation Sent",
        description: `Invited ${user.name} to team "${team.name}"`,
      });

      // Refresh user list to get updated inviteStatus
      fetchAllUsers(team.id);
    } catch (error) {
      toast({
        title: "Failed to Send Invitation",
        description: "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Members</DialogTitle>
          <DialogDescription>Invite users to your team.</DialogDescription>
        </DialogHeader>

        <Input
          placeholder="Search users by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />

        <div className="h-[400px] overflow-y-auto space-y-3 border rounded-md p-2 bg-muted">
          {filteredUsers.map((user) => {
            const status = user.inviteStatus;

            return (
              <div
                key={user.id}
                className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>

                {status === "PENDING" ? (
                  <Button size="sm" variant="outline" disabled>
                    Pending
                  </Button>
                ) : status === "DECLINED" ? (
                  <Button size="sm" onClick={() => handleInvite(user)}>
                    Resend
                  </Button>
                ) : status === "ACCEPTED" ? (
                  <Button size="sm" variant="outline" disabled>
                    Joined
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => handleInvite(user)}>
                    Invite
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
