'use client';

import { FC, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Project } from "@/lib/types";
import { inviteUserToProject } from "@/app/api/projects/invite";
import { useToast } from "@/hooks/use-toast";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  projects: Project[];
}

const InviteModal: FC<InviteModalProps> = ({ isOpen, onClose, userId, projects }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInvite = async () => {
    if (!selectedProjectId) return;

    try {
      setIsSubmitting(true);
      await inviteUserToProject({ projectId: selectedProjectId, userId });
      toast({
        title: "Invitation Sent!",
        description: "User has been invited to join your project.",
      });
      onClose();
    } catch (error) {
      console.error("Failed to invite user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite to Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Select a project</label>
            <Select
                value={selectedProjectId ?? ""}
                onValueChange={(value) => setSelectedProjectId(value)}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select a project..." />
                </SelectTrigger>
                <SelectContent>
                    {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                        {project.title}
                    </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleInvite} disabled={!selectedProjectId || isSubmitting}>
            {isSubmitting ? "Inviting..." : "Send Invite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
