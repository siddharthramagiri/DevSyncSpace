'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface TeamOption {
  id: string;
  name: string;
}

interface NewProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreate?: (project: {
    title: string;
    description?: string | undefined | null;
    githubUrl?: string | undefined | null;
    teamId: string;
  }) => void;
  onCreateTeam?: (team: { name: string }) => Promise<TeamOption>; // Function to create a new team
}

const NewProjectModal = ({
  open,
  onClose,
  onCreate,
  onCreateTeam,
}: NewProjectModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [newTeamName, setNewTeamName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title || !newTeamName) return;

    setLoading(true);

    try {
      // Create a new team
      const newTeam = await onCreateTeam?.({ name: newTeamName });

      if (newTeam?.id) {
        // Call the onCreate function to create the project with the new team
        onCreate?.({
          title,
          description,
          githubUrl,
          teamId: newTeam.id, // Use the newly created team's ID
        });
        setLoading(false);
        onClose();
      } else {
        throw new Error('Failed to create new team.');
      }
    } catch (err) {
      console.error('Error creating project or team:', err);
      setLoading(false);
    } finally {
      setTitle('')
      setDescription('')
      setGithubUrl('')
      setNewTeamName('')
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>
            Create a new project and a new team to track tasks and progress.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Project Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="github">GitHub URL</Label>
            <Input id="github" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="new-team">New Team Name</Label>
            <Input
              id="new-team"
              placeholder="Enter new team name"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={loading || !title || !newTeamName}
          >
            {loading ? 'Creating...' : 'Create Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectModal;
