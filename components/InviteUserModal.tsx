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
import { toast } from "@/hooks/use-toast";
import getAllUsers from "@/app/api/user/getAllUsers";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/lib/types";
import { MyTeam } from "@/app/api/teams/getMyTeams";


interface InviteUsersModalProps {
  team: MyTeam;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteUsersModal({ team, open, onOpenChange }: InviteUsersModalProps) {
  const [search, setSearch] = useState("");
  const {toast} = useToast();

  const [users, setUsers] = useState<User[]>([]);

  const fetchAllUsers = async (id: string) => {
    try {
        const {users, error} = await getAllUsers(id);
        if(!users || error) {
            toast({variant: 'destructive', description: error});
            return;
        }
        setUsers(users);
    } catch (error) {
        toast({variant: 'destructive', description: "Error Fetching Users"});
    }
  }

  useEffect(() => {
    fetchAllUsers(team.id);
  }, [team.id])

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleInvite = (user: User) => {
    toast({
      title: "Invitation Sent",
      description: `Invited ${user.name} to team "${team.name}"`,
    });
    // Add your API call for invitation here
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

          {filteredUsers.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No users found.</p>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
                <Button size="sm" onClick={() => handleInvite(user)}>
                  Invite
                </Button>
              </div>
            ))
          )}
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
