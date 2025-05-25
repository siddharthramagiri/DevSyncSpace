
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { TeamMember } from "@/types/project";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NewProjectDialogProps {
  teamMembers: TeamMember[];
  onCreateProject: (projectData: {
    name: string;
    description: string;
    repository: string;
    technologies: string;
    teamMembers: string[];
  }) => void;
}

export const NewProjectDialog = ({ teamMembers, onCreateProject }: NewProjectDialogProps) => {
  const [open, setOpen] = useState(false);
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    repository: "",
    technologies: "",
    teamMembers: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateProject(projectData);
    setProjectData({
      name: "",
      description: "",
      repository: "",
      technologies: "",
      teamMembers: []
    });
    setOpen(false);
  };

  const toggleTeamMember = (memberId: string) => {
    setProjectData(prev => {
      if (prev.teamMembers.includes(memberId)) {
        return {
          ...prev,
          teamMembers: prev.teamMembers.filter(id => id !== memberId)
        };
      } else {
        return {
          ...prev,
          teamMembers: [...prev.teamMembers, memberId]
        };
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Add a new project to collaborate with your team
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={projectData.name}
                onChange={e => setProjectData({...projectData, name: e.target.value})}
                placeholder="E.g. Customer Portal"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={projectData.description}
                onChange={e => setProjectData({...projectData, description: e.target.value})}
                placeholder="Briefly describe the project and its goals"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="repository">Repository URL</Label>
              <Input
                id="repository"
                value={projectData.repository}
                onChange={e => setProjectData({...projectData, repository: e.target.value})}
                placeholder="https://github.com/example/project"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="technologies">Technologies</Label>
              <Input
                id="technologies"
                value={projectData.technologies}
                onChange={e => setProjectData({...projectData, technologies: e.target.value})}
                placeholder="React, Node.js, MongoDB, etc. (comma separated)"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Team Members</Label>
              <div className="grid grid-cols-2 gap-3">
                {teamMembers.map(member => (
                  <div key={member.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`member-${member.id}`}
                      checked={projectData.teamMembers.includes(member.id)}
                      onCheckedChange={() => toggleTeamMember(member.id)}
                    />
                    <Label htmlFor={`member-${member.id}`} className="flex items-center cursor-pointer">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm">{member.name}</div>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
