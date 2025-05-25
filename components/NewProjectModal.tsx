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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { getMyTeams, MyTeam } from '@/app/api/teams/getMyTeams';
import { useToast } from '@/hooks/use-toast';

interface NewProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreate?: (project: {
    title: string;
    description?: string | undefined | null;
    githubUrl?: string | undefined | null;
    teamId: string;
  }) => void;
  onCreateTeam?: (team: { name: string }) => Promise<MyTeam>; // Function to create a new team
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
  const [useNewTeam, setUseNewTeam] = useState(false);
  const [existingTeams, setExistingTeams] = useState<MyTeam[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [newTeamName, setNewTeamName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch existing teams
    const fetchTeams = async () => {
      try {
        const {teams, error} = await getMyTeams();
        if(error) {
          toast({variant:'destructive' , description: error})
          return;
        }
        if(!teams) {
          toast({variant:'destructive' , description: "Error Loading Teams!"})
          return;
        }
        setExistingTeams(teams);
      } catch (error) {
        toast({variant:'destructive' , description: "Unexpected Error Occurred!"})
      }
    };
    if (open) fetchTeams();
  }, [open]);

  const handleCreate = async () => {
    if (!title || (!useNewTeam && !selectedTeamId)) return;

    setLoading(true);

    try {
      let teamId = selectedTeamId;

      // Create new team if selected
      if (useNewTeam) {
        if (!newTeamName) return;
        const newTeam = await onCreateTeam?.({ name: newTeamName });
        if (!newTeam?.id) throw new Error('Failed to create new team.');
        teamId = newTeam.id;
      }

      // Proceed with creating the project
      await onCreate?.({
        title,
        description,
        githubUrl,
        teamId,
      });

      onClose(); // Close modal
    } catch (err) {
      console.error('Error creating project or team:', err);
    } finally {
      setTitle('');
      setDescription('');
      setGithubUrl('');
      setNewTeamName('');
      setSelectedTeamId('');
      setUseNewTeam(false);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>
            Create a new project under a team (existing or new).
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
            <div className="flex items-center justify-between">
              <Label>Team</Label>
              <Button
                variant="link"
                className="text-sm"
                onClick={() => setUseNewTeam((prev) => !prev)}
              >
                {useNewTeam ? 'Select Existing Team' : 'Create New Team'}
              </Button>
            </div>

            {useNewTeam ? (
              <Input
                placeholder="Enter new team name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
            ) : (
              <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select existing team" />
                </SelectTrigger>
                <SelectContent>
                  {existingTeams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={loading || !title || (useNewTeam && !newTeamName)}>
            {loading ? 'Creating...' : 'Create Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectModal;
