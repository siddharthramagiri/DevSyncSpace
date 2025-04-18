
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

const Dashboard = () => {
  const { toast } = useToast();

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
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">284</div>
            <p className="text-xs text-muted-foreground">
              +38 this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Across 5 teams
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Next: Standup (Tomorrow)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Row */}
      <div>
        <h2 className="mb-4 text-xl font-bold">Project Status</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Project Card 1 */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>E-commerce Platform</CardTitle>
                  <CardDescription>Frontend Development</CardDescription>
                </div>
                <Badge className="bg-yellow-500 hover:bg-yellow-600">In Progress</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <div>Progress</div>
                    <div>65%</div>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>Deadline: Oct 15, 2023</span>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white">JD</div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-xs font-medium text-white">AK</div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-xs font-medium text-white">RB</div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-300 text-xs font-medium text-gray-800">+2</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Card 2 */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Mobile Banking App</CardTitle>
                  <CardDescription>Full-stack Development</CardDescription>
                </div>
                <Badge className="bg-blue-500 hover:bg-blue-600">Planning</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <div>Progress</div>
                    <div>20%</div>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>Deadline: Dec 10, 2023</span>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500 text-xs font-medium text-white">TS</div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">MK</div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-300 text-xs font-medium text-gray-800">+4</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Card 3 */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Analytics Dashboard</CardTitle>
                  <CardDescription>Data Visualization</CardDescription>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <div>Progress</div>
                    <div>100%</div>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>Completed: Sept 28, 2023</span>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-500 text-xs font-medium text-white">LW</div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-500 text-xs font-medium text-white">PD</div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-300 text-xs font-medium text-gray-800">+1</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div>
        <h2 className="mb-4 text-xl font-bold">Upcoming Deadlines</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">Frontend Authentication Flow</div>
                    <div className="text-sm text-muted-foreground">E-commerce Platform</div>
                  </div>
                </div>
                <div className="text-sm font-medium text-red-600">Today</div>
                <Button variant="outline" size="sm">View Tasks</Button>
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">API Integration</div>
                    <div className="text-sm text-muted-foreground">Mobile Banking App</div>
                  </div>
                </div>
                <div className="text-sm font-medium text-orange-600">2 days</div>
                <Button variant="outline" size="sm">View Tasks</Button>
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">User Testing</div>
                    <div className="text-sm text-muted-foreground">E-commerce Platform</div>
                  </div>
                </div>
                <div className="text-sm font-medium">1 week</div>
                <Button variant="outline" size="sm">View Tasks</Button>
              </div>
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
