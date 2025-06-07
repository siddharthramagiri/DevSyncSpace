"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Team } from "@/lib/types";
import { updateTeamDetails, removeTeamMember } from "@/app/api/teams/teamActions";
import { useToast } from "@/hooks/use-toast";
import { MyTeam } from "@/app/app/teams/page";

interface ManageTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: MyTeam;
  refreshTeams: () => void;
}

export default function ManageTeamModal({ open, onOpenChange, team, refreshTeams }: ManageTeamModalProps) {
  const { toast } = useToast();
  const [name, setName] = useState(team.name);
  const [members, setMembers] = useState(team.members || []);

  useEffect(() => {
    setName(team.name);
    setMembers(team.members || []);
  }, [team]);

  const handleSave = async () => {
    const { message, error } = await updateTeamDetails(team.id, name);
    if (error) {
      toast({ title: "Update Failed", description: error, variant: "destructive" });
      return;
    }
    toast({ title: "Updated", description: message });
    refreshTeams();
    onOpenChange(false);
  };

  const handleRemoveMember = async (userId: string) => {
    const confirmed = confirm("Are you sure you want to remove this member?");
    if (!confirmed) return;

    const { message, error } = await removeTeamMember(team.id, userId);
    if (error) {
      toast({ title: "Remove Failed", description: error, variant: "destructive" });
      return;
    }
    toast({ title: "Member Removed", description: message });
    setMembers((prev) => prev.filter((m) => m.userId !== userId));
    refreshTeams();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Team: {team.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="team-name" className="block text-sm font-medium text-foreground">
              Team Name
            </label>
            <Input
              id="team-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-semibold">Members</h3>
            {members.map((member) => (
              <div key={member.user?.id} className="flex items-center justify-between rounded px-2 py-1">
                <div>
                  <p className="text-sm font-medium">{member.user?.name}</p>
                  <p className="text-xs text-muted-foreground">{member.user?.email}</p>
                </div>
                {member.userId !== team.leaderId && (
                  <Button size="sm" variant="destructive" onClick={() => handleRemoveMember(member.userId)}>
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
