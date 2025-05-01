'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileCode,
  MoreHorizontal,
  Plus,
  User,
  Users,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getUserProjects } from "@/app/api/projects";
import { useEffect, useState } from "react";
import getUserId from "@/app/api/user/getUserId";
import { Project } from "@/lib/types";


const Dashboard = () => {
    const { toast } = useToast();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [teamActivities, setTeamActivities] = useState<any[]>([]); // Replace 'any' with your activity type
   

    const upcomingTasks = projects.flatMap(project =>
        (project.tasks ?? []).map(task => ({
            ...task,
            projectTitle: project.title,
        }))
        ).filter(task => {
            const dueDate = new Date(task.dueDate ?? "");
            const today = new Date();
            return dueDate >= today;
    }).filter((task: any) => task.dueDate).sort((a, b) => new Date(a.dueDate || "").getTime() - new Date(b.dueDate || "").getTime()).slice(0, 3);
      

    useEffect(() => {
        const fetchProjects = async () => {
          try {
            const { id, error: userError } = await getUserId();
            if (userError || !id) throw new Error("Failed to fetch user ID");
      
            const { projects: fetchedProjects, error: projectsError } = await getUserProjects(id);
            if (projectsError || !fetchedProjects) throw new Error("Failed to fetch projects");
      
            setProjects(fetchedProjects.map(p => ({ 
                ...p, 
                description: p.description ?? undefined, 
                githubUrl: p.githubUrl ?? undefined 
            })));
          } catch (err: any) {
            
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
      
        fetchProjects();
    }, []);

    // useEffect(() => {
    //     const fetchTeamActivity = async () => {
    //         try {
    //             const { id, error: userError } = await getUserId();
    //             if (userError || !id) throw new Error("Failed to fetch user ID");

    //             const { projects: fetchedProjects, error: projectsError } = await getUserProjects(id);
    //             if (projectsError || !fetchedProjects) throw new Error("Failed to fetch projects");

    //             const activities: any[] = [];

    //             // Loop through projects and extract team activities (you may have a better structure for activities)
    //             fetchedProjects.forEach(project => {
    //                 project.tasks?.forEach(task => {
    //                     if (task.status === "COMPLETED") {
    //                         activities.push({
    //                             user: task.assignedTo, // Assuming `assignedTo` holds the user
    //                             activity: `completed the task "${task.title}"`,
    //                             timestamp: task.updatedAt, // Adjust based on your task object structure
    //                         });
    //                     }
    //                 });

    //                 project.team?.members?.forEach(member => {
    //                     // Activity for team members (e.g., meetings, PRs)
    //                     activities.push({
    //                         user: member.user,
    //                         activity: `joined the team`,
    //                         timestamp: new Date(), // Example timestamp
    //                     });
    //                 });
    //             });

    //             setTeamActivities(activities);
    //         } catch (err: any) {
    //             console.error(err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchTeamActivity();
    // }, []);


  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, here's an overview of your projects.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={() => {
            toast({title: "New Project", description: "Project creation would be implemented here."})
            }
          }>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FileCode className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">
                {projects.filter(project =>
                (project.tasks ?? []).some(task => task.status !== "COMPLETED")
                ).length}
            </div>
            <p className="text-xs text-muted-foreground">Real-time status</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">
                {projects.reduce((acc, project) => (
                acc + (project.tasks?.filter(task => task.status === "COMPLETED").length || 0)
                ), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">
                {new Set(
                projects.flatMap(p => (p.team?.members ?? []).map(m => m.user?.id))
                ).size}
            </div>
            <p className="text-xs text-muted-foreground">Unique contributors</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">
                {
                projects.reduce((acc, project) => (
                    acc + (project.tasks?.filter(task => {
                    const due = new Date(task.dueDate ?? "");
                    return task.dueDate && due > new Date();
                    }).length || 0)
                ), 0)
                }
            </div>
            <p className="text-xs text-muted-foreground">With future deadlines</p>
            </CardContent>
        </Card>
        </div>


      {/* Projects Row */}
      <div>
      <h2 className="mb-4 text-xl font-bold">Project Status</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const totalTasks = (project.tasks ?? []).length;
          const completedTasks = (project.tasks ?? []).filter((t) => t.status === "COMPLETED").length;
          const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

          return (
            <Card key={project.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>{project.description || "No description"}</CardDescription>
                  </div>
                  <Badge
                    className={
                      completedTasks === totalTasks && totalTasks > 0
                        ? "bg-green-500 hover:bg-green-600"
                        : completedTasks > 0
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    }
                  >
                    {completedTasks === totalTasks && totalTasks > 0
                      ? "Completed"
                      : completedTasks > 0
                      ? "In Progress"
                      : "Pending"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <div>Progress</div>
                      <div>{progressPercent}%</div>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>
                        {(project.tasks ?? []).find((t) => t.dueDate)
                          ? `Next Deadline: ${new Date((project.tasks ?? []).find((t) => t.dueDate)?.dueDate || "").toLocaleDateString()}`
                          : "No due dates"}
                      </span>
                    </div>
                    <div className="flex -space-x-2">
                      {(project.team?.members ?? []).slice(0, 3).map((member) => (
                        <div
                          key={member.id}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-300 text-xs font-medium text-gray-800"
                          title={member.user?.name || member.user?.email || "Unknown User"}
                        >
                          {(member.user?.name?.charAt(0).toUpperCase() || "?") ?? "?"}
                        </div>
                      ))}
                      {(project.team?.members?.length ?? 0) > 3 && (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-300 text-xs font-medium text-gray-800">
                          +{(project.team?.members?.length ?? 0) - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>

        {/* Upcoming Deadlines */}
        <div>
        <h2 className="mb-4 text-xl font-bold">Upcoming Deadlines</h2>
        <Card>
            <CardContent className="p-0">
            <div className="divide-y">
                {projects
                .flatMap(project => 
                    (project.tasks ?? []).map(task => ({
                    ...task,
                    projectTitle: project.title,
                    dueDateObj: new Date(task.dueDate ?? ""),
                    }))
                )
                .filter(task => task.dueDate && task.dueDateObj > new Date())
                .sort((a, b) => a.dueDateObj.getTime() - b.dueDateObj.getTime())
                .slice(0, 5) // limit to top 5 upcoming
                .map((task, index) => {
                    const now = new Date();
                    const diffMs = task.dueDateObj.getTime() - now.getTime();
                    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                    const urgencyColor = diffDays <= 1 ? 'text-red-600 bg-red-100' 
                                    : diffDays <= 3 ? 'text-orange-600 bg-orange-100' 
                                    : 'text-green-600 bg-green-100';

                    return (
                    <div key={index} className="flex items-center justify-between p-4">
                        <div className="flex items-center">
                        <div className={`mr-4 flex h-10 w-10 items-center justify-center rounded-full ${urgencyColor}`}>
                            <Clock className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="font-medium">{task.title}</div>
                            <div className="text-sm text-muted-foreground">{task.projectTitle}</div>
                        </div>
                        </div>
                        <div className={`text-sm font-medium ${urgencyColor.replace('bg-', '')}`}>
                        {diffDays === 0 ? "Today" : `${diffDays} day${diffDays > 1 ? "s" : ""}`}
                        </div>
                        <Button variant="outline" size="sm">View Task</Button>
                    </div>
                    );
                })}
            </div>
            </CardContent>
        </Card>
        </div>

      {/* Team Activity */}
      <div>
        <h2 className="mb-4 text-xl font-bold">Recent Team Activity</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              <div className="flex items-center p-4">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xs font-medium">JD</div>
                <div>
                  <div className="font-medium">Jane Doe completed the task "Implement User Authentication"</div>
                  <div className="text-sm text-muted-foreground">2 hours ago</div>
                </div>
              </div>
              <div className="flex items-center p-4">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xs font-medium">MK</div>
                <div>
                  <div className="font-medium">Mike Kim created a new pull request "Fix payment processing bug"</div>
                  <div className="text-sm text-muted-foreground">5 hours ago</div>
                </div>
              </div>
              <div className="flex items-center p-4">
                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xs font-medium">TS</div>
                <div>
                  <div className="font-medium">Tara Smith scheduled a meeting "API Integration Planning"</div>
                  <div className="text-sm text-muted-foreground">Yesterday at 4:30 PM</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
