
import { Project } from "@/types/project";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, CheckCircle2, Clock, FileCode, Github, GitBranch, ExternalLink } from "lucide-react";

interface ProjectDetailProps {
  project: Project;
}

export const ProjectDetail = ({ project }: ProjectDetailProps) => {
  // Function to calculate days remaining (demo purposes)
  const daysRemaining = () => {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 14); // Demo deadline 14 days from now
    return Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </div>
            <div className="flex space-x-2">
              <a 
                href={project.repository} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <Github className="h-4 w-4 mr-1" />
                Repository
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Project Progress</h3>
                  <span className="text-sm font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, i) => (
                    <Badge key={i} variant="outline">{tech}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Timeline</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span>
                      Updated {formatDistanceToNow(new Date(project.lastUpdated), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                    <span>{daysRemaining()} days remaining until deadline</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <GitBranch className="h-4 w-4 mr-2 text-gray-500" />
                    <span>5 active branches</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FileCode className="h-4 w-4 mr-2 text-gray-500" />
                    <span>42 files changed in last week</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Recent Activities</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">New Pull Request Merged</p>
                      <p className="text-xs text-gray-500">
                        PR #42: Add shopping cart functionality
                        <span className="block">2 hours ago by Alex Johnson</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5">
                      <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <GitBranch className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">New Branch Created</p>
                      <p className="text-xs text-gray-500">
                        Branch: feature/payment-integration
                        <span className="block">5 hours ago by Mira Patel</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5">
                      <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center">
                        <FileCode className="h-4 w-4 text-amber-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Code Review Requested</p>
                      <p className="text-xs text-gray-500">
                        PR #41: Refactor product listing component
                        <span className="block">Yesterday by Jordan Chen</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-2">Team ({project.team.length})</h3>
                <div className="flex flex-wrap gap-3">
                  {project.team.map((member) => (
                    <div key={member.id} className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
