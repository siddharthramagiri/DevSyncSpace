
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Plus, Search, User, Users, Star, UserPlus, MoreHorizontal, Mail, Github } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  status: "online" | "offline" | "away";
}

interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  projects: number;
}

const Teams = () => {
  const { toast } = useToast();
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data
  const teams: Team[] = [
    {
      id: "1",
      name: "Frontend Team",
      description: "Responsible for UI/UX implementation and client-side logic",
      members: [
        { id: "1", name: "Alex Johnson", role: "Team Lead", email: "alex@example.com", avatar: "", status: "online" },
        { id: "2", name: "Mira Patel", role: "Senior Developer", email: "mira@example.com", avatar: "", status: "online" },
        { id: "3", name: "Sam Rodriguez", role: "Developer", email: "sam@example.com", avatar: "", status: "away" },
        { id: "4", name: "Taylor Kim", role: "Designer", email: "taylor@example.com", avatar: "", status: "offline" },
      ],
      projects: 5,
    },
    {
      id: "2",
      name: "Backend Team",
      description: "API development and server-side architecture",
      members: [
        { id: "5", name: "Jordan Chen", role: "Team Lead", email: "jordan@example.com", avatar: "", status: "online" },
        { id: "6", name: "Riley Singh", role: "Senior Developer", email: "riley@example.com", avatar: "", status: "away" },
        { id: "7", name: "Casey Williams", role: "Database Engineer", email: "casey@example.com", avatar: "", status: "offline" },
      ],
      projects: 3,
    },
    {
      id: "3",
      name: "DevOps Team",
      description: "CI/CD pipelines and infrastructure management",
      members: [
        { id: "8", name: "Morgan Lee", role: "DevOps Lead", email: "morgan@example.com", avatar: "", status: "online" },
        { id: "9", name: "Jamie Garcia", role: "Cloud Engineer", email: "jamie@example.com", avatar: "", status: "offline" },
      ],
      projects: 2,
    },
  ];

  const handleCreateTeam = () => {
    setIsCreatingTeam(true);
    // Simulate team creation
    setTimeout(() => {
      setIsCreatingTeam(false);
      toast({
        title: "Team created",
        description: "Your new team has been created successfully.",
      });
    }, 1500);
  };

  const availableMembers: TeamMember[] = [
    { id: "10", name: "Robin Patel", role: "Senior Developer", email: "robin@example.com", avatar: "", status: "online" },
    { id: "11", name: "Avery Johnson", role: "Designer", email: "avery@example.com", avatar: "", status: "online" },
    { id: "12", name: "Quinn Li", role: "Product Manager", email: "quinn@example.com", avatar: "", status: "away" },
  ];

  // Filter available members based on search query
  const filteredMembers = availableMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-muted-foreground">Manage your teams and team members.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new team</DialogTitle>
                <DialogDescription>
                  Add team details and invite members to collaborate.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="team-name">Team name</Label>
                  <Input id="team-name" placeholder="e.g. Product Development" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-description">Description (optional)</Label>
                  <Input id="team-description" placeholder="What does this team do?" />
                </div>
                <div className="space-y-2">
                  <Label>Team members</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users by name or email..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="mt-2 max-h-40 overflow-y-auto rounded-md border">
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-2 hover:bg-accent">
                          <div className="flex items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                              {member.name.charAt(0)}
                            </div>
                            <div className="ml-2">
                              <div className="text-sm font-medium">{member.name}</div>
                              <div className="text-xs text-muted-foreground">{member.email}</div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8" onClick={() => toast({ title: "Member added", description: `${member.name} has been added to the team.` })}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-center text-sm text-muted-foreground">
                        No members found
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => toast({ title: "Cancelled", description: "Team creation cancelled." })}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTeam} disabled={isCreatingTeam}>
                  {isCreatingTeam ? "Creating..." : "Create Team"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="teams">
        <TabsList className="mb-4">
          <TabsTrigger value="teams">My Teams</TabsTrigger>
          <TabsTrigger value="all">All Teams</TabsTrigger>
          <TabsTrigger value="invites">Invites</TabsTrigger>
        </TabsList>
        <TabsContent value="teams" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <Card key={team.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>{team.name}</CardTitle>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>{team.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{team.members.length}</span> members
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{team.projects}</span> projects
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      {team.members.slice(0, 3).map((member) => (
                        <div key={member.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="relative">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-medium">
                                {member.name.split(" ").map(n => n[0]).join("")}
                              </div>
                              <span 
                                className={`absolute bottom-0 right-0 h-2 w-2 rounded-full ring-1 ring-white ${
                                  member.status === "online" 
                                    ? "bg-green-500" 
                                    : member.status === "away" 
                                    ? "bg-yellow-500" 
                                    : "bg-gray-500"
                                }`} 
                              />
                            </div>
                            <div className="ml-2">
                              <div className="text-sm font-medium">{member.name}</div>
                              <div className="text-xs text-muted-foreground">{member.role}</div>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7"
                              onClick={() => toast({ title: "Email sent", description: `Email sent to ${member.name}.` })}
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {team.members.length > 3 && (
                        <Button 
                          variant="ghost" 
                          className="text-sm text-muted-foreground hover:text-foreground"
                          onClick={() => toast({ title: "View Members", description: "This would show all team members." })}
                        >
                          View all {team.members.length} members
                        </Button>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        size="sm"
                        onClick={() => toast({ title: "Team Management", description: "This would open team management." })}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Manage
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        size="sm"
                        onClick={() => toast({ title: "Member Invitation", description: "This would open the invitation dialog." })}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Invite
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Teams</CardTitle>
              <CardDescription>
                Browse all teams in the organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search teams..." className="pl-8" />
                </div>
                <div className="rounded-md border">
                  {[...teams, {
                    id: "4",
                    name: "Machine Learning Team",
                    description: "AI/ML model development",
                    members: [{ id: "14", name: "Pat Chen", role: "Data Scientist", email: "pat@example.com", avatar: "", status: "online" }],
                    projects: 1,
                  }].map((team) => (
                    <div key={team.id} className="flex items-center justify-between border-b p-4 last:border-0">
                      <div>
                        <div className="font-medium">{team.name}</div>
                        <div className="text-sm text-muted-foreground">{team.description}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm text-muted-foreground">{team.members.length} members</div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toast({ title: "Join Request", description: `Request to join ${team.name} sent.` })}
                        >
                          Request to Join
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="invites">
          <Card>
            <CardHeader>
              <CardTitle>Team Invitations</CardTitle>
              <CardDescription>
                Pending invitations to teams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="flex items-center justify-between border-b p-4">
                    <div className="flex-1">
                      <div className="font-medium">Data Engineering Team</div>
                      <div className="text-sm text-muted-foreground">Invited by Jordan Chen • 2 days ago</div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toast({ title: "Invitation Declined", description: "Invitation to Data Engineering Team declined." })}
                      >
                        Decline
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => toast({ title: "Invitation Accepted", description: "You've joined the Data Engineering Team." })}
                      >
                        Accept
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div className="flex-1">
                      <div className="font-medium">Mobile Development Team</div>
                      <div className="text-sm text-muted-foreground">Invited by Alex Johnson • 5 days ago</div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toast({ title: "Invitation Declined", description: "Invitation to Mobile Development Team declined." })}
                      >
                        Decline
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => toast({ title: "Invitation Accepted", description: "You've joined the Mobile Development Team." })}
                      >
                        Accept
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="text-center text-sm text-muted-foreground">No more pending invitations</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Teams;
