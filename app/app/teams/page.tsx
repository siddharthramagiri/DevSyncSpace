'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Adjust path as needed
import { Plus, Search, Users, Star, UserPlus, MoreHorizontal, Mail, Github } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getMyTeams } from "@/app/api/teams/getMyTeams";
import { getAllTeams } from "@/app/api/teams/getAllTeams";
import getUserId from "@/app/api/user/getUserId";
import { deleteTeam } from "@/app/api/teams/DeleteTeam";
import { InviteUsersModal } from "@/components/InviteUserModal";
import { TeamInvitation } from "@/lib/types";
import { getMyInvitations } from "@/app/api/invite/get/getMyInvitations";
import { acceptInvitation } from "@/app/api/invite/accept/acceptInvitation";
import { declineInvitation } from "@/app/api/invite/decline/declineInvitation";
import { RefreshCw } from "lucide-react";
import ManageTeamModal from "@/components/ManageTeamModal";

export interface TeamMemberUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  user: TeamMemberUser;
}

export interface MyTeam {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  leaderId:string;
  leader?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  members: TeamMember[];
  projects: any[];
}

const Teams = () => {
  const { toast } = useToast();
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [teams, setTeams] = useState<MyTeam[]>([]);
  const [allTeams, setAllTeams] = useState<MyTeam[]>([]);
  const [userId, setUserId] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<MyTeam | null>(null);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);  // loading teams on fetch
  const [isDeleting, setIsDeleting] = useState(false);  
  const [inviteModalTeam, setInviteModalTeam] = useState<MyTeam | null>(null);
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [manageModalOpen, setManageModalOpen] = useState(false);

  const fetchMyTeams = async () => {
    try {
      const {teams, error} = await getMyTeams();
      if(error) {
        toast({variant : 'destructive' , description: error});
        return;
      }
      if (!teams) {
        toast({ variant: "destructive", description: "No teams found." });
        return;
      }
      setTeams(teams);
      toast({description : "Fetched Teams"});
      
    } catch (error) {
      toast({variant : 'destructive' , description: "Error Occured during fetching Teams"});
    }
  }

  const handleDelete = async (teamId: string) => {
    const confirmed = confirm("Are you sure you want to delete this team?");
    if (confirmed) {
      setIsDeleting(true);
      try {
        const { message, error } = await deleteTeam(teamId);
        if (!message || error) {
          toast({ variant: "destructive", description: error });
        } else {
          toast({
            title: "Team Deleted",
            description: message,
          });
        }
        fetchMyTeams();
      } catch {
        toast({ variant: "destructive", description: `Error deleting the team` });
      } finally {
        setIsDeleting(false);
      }
    }
  };
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

  const fetchAllTeams = async () => {
    setIsLoadingTeams(true);
    try {
      const { teams, error } = await getAllTeams();
      if (error) {
        toast({ variant: "destructive", description: error });
        setIsLoadingTeams(false);
        return;
      }
      if (!teams) {
        toast({ variant: "destructive", description: "No teams found." });
        setIsLoadingTeams(false);
        return;
      }
      setAllTeams(teams);
    } catch {
      toast({ variant: "destructive", description: "Error occurred during fetching Teams" });
    } finally {
      setIsLoadingTeams(false);
    }
  }

  const fetchUserId = async () => {
    try {
      const {id, error} = await getUserId();
      if(!id || error) {
        toast({variant:'destructive', description: error})
        return;
      }
      setUserId(id);
    } catch (error) {
      toast({variant:'destructive', description: "Error Authorization"});
      return;
    }
  }

  const fetchInvitations = async () => {
    try {
      const { invitations, error } = await getMyInvitations();
      if (error) {
        toast({ variant: "destructive", description: error });
        return;
      }
      setInvitations(invitations || []);
    } catch (err) {
      toast({ variant: "destructive", description: "Failed to fetch invitations" });
    }
  };

  const handleAccept = async (inviteId: string, teamId: string) => {
    const { message, error } = await acceptInvitation(inviteId, teamId);
    if (error) {
      toast({ variant: "destructive", description: error });
    } else {
      toast({ title: "Invitation Accepted", description: message });
      fetchInvitations();
      fetchMyTeams();
    }
  };

  const handleDecline = async (inviteId: string) => {
    const { message, error } = await declineInvitation(inviteId);
    if (error) {
      toast({ variant: "destructive", description: error });
    } else {
      toast({ title: "Invitation Declined", description: message });
      fetchInvitations();
    }
  };
  
  useEffect(() => {
    fetchUserId();
    fetchMyTeams();
    fetchAllTeams();
    fetchInvitations();
  },[])

  // const availableMembers: TeamMember[] = [
  //   { id: "10", name: "Robin Patel", role: "Senior Developer", email: "robin@example.com", avatar: "", status: "online" },
  //   { id: "11", name: "Avery Johnson", role: "Designer", email: "avery@example.com", avatar: "", status: "online" },
  //   { id: "12", name: "Quinn Li", role: "Product Manager", email: "quinn@example.com", avatar: "", status: "away" },
  // ];

  // // Filter available members based on search query
  // const filteredMembers = availableMembers.filter(
  //   (member) =>
  //     member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     member.email.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-muted-foreground">Manage your teams and team members.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button className="mx-5" variant="outline" onClick={() => {
            fetchUserId();
            fetchMyTeams();
            fetchAllTeams();
            fetchInvitations();
          }}>
            <RefreshCw className="h-4 w-4" />
          </Button>
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
        {isLoadingTeams ? (
          <div className="text-center py-10">Loading teams...</div>
        ) : teams.length === 0 ? (
          <div className="text-center py-10">No teams available.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <Card key={team.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>{team.name}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {userId === team.leaderId ? (
                          <>
                            {/* <DropdownMenuItem onClick={() => handleEdit(team)}>
                              Edit
                            </DropdownMenuItem> */}
                            <DropdownMenuItem onClick={() => handleDelete(team.id)}>
                              Delete
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <DropdownMenuItem disabled>Not authorized</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription>{team.description || "No description"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{team.members.length}</span> members
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{team.projects.length}</span> projects
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 justify-between">
                      {team.members.slice(0, 3).map((member) => (
                        <div key={member.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="relative">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-medium">
                                {member.user.name
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                            </div>
                            <div className="ml-2">
                              <div className="text-sm font-medium">{member.user.name}</div>
                              <div className="text-xs text-muted-foreground">Developer</div>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                toast({
                                  title: "Email sent",
                                  description: `Email sent to ${member.user.email}`,
                                })
                              }
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
                          onClick={() =>
                            toast({
                              title: "View Members",
                              description: `Team "${team.name}" has ${team.members.length} members.`,
                            })
                          }
                        >
                          View all {team.members.length} members
                        </Button>
                      )}
                    </div>
                    {userId === team.leaderId && (
                      <div className="flex space-x-2 justify-end">
                        <Button
                          variant="outline"
                          className="w-full"
                          size="sm"
                          onClick={() => {
                              setSelectedTeam(team);
                              setManageModalOpen(true);
                            }
                          }
                        >
                          <Users className="mr-2 h-4 w-4" />
                          Manage
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          size="sm"
                          onClick={() => setInviteModalTeam(team)} // Open modal for this team
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          Invite
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>   
        )}
        </TabsContent>
        {inviteModalTeam && (
          <InviteUsersModal
            team={inviteModalTeam}
            open={Boolean(inviteModalTeam)}
            onOpenChange={(open) => {
              if (!open) setInviteModalTeam(null);
            }}
          />
        )}
        {manageModalOpen && (
          <ManageTeamModal
            open={manageModalOpen}
            onOpenChange={setManageModalOpen}
            team={selectedTeam!}
            refreshTeams={fetchMyTeams}
          />
        )}
        
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
                  {[...allTeams, 
                  // {
                  //   id: "4",
                  //   name: "Machine Learning Team",
                  //   description: "AI/ML model development",
                  //   members: [{ id: "14", name: "Pat Chen", role: "Data Scientist", email: "pat@example.com", avatar: "", status: "online" }],
                  //   projects: 1,
                  // }
                ].map((team) => (
                    <div key={team.id} className="flex items-center justify-between border-b p-4 last:border-0">
                      <div>
                        <div className="font-medium">{team.name}</div>
                        <div className="text-sm text-muted-foreground">Created by {team.leader?.name ?? "Unknown"}</div>
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
              <CardDescription>Pending invitations to teams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invitations.length > 0 ? (
                  invitations.map((invite) => (
                    <div key={invite.id} className="rounded-md border">
                      <div className="flex items-center justify-between p-4">
                        <div className="flex-1">
                          <div className="font-medium">{invite.team?.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Invited by {invite.inviter?.name || "Unknown"} •{" "}
                            {new Date(invite.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDecline(invite.id)}
                          >
                            Decline
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAccept(invite.id, invite.teamId)}
                          >
                            Accept
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-muted-foreground">
                    No pending invitations
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default Teams;
