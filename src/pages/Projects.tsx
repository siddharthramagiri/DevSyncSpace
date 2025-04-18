
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  FolderTree, 
  Users,
} from "lucide-react";
import { ProjectList } from "@/components/projects/ProjectList";
import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { ProjectFileExplorer } from "@/components/projects/ProjectFileExplorer";
import { FileViewer } from "@/components/projects/FileViewer";
import { NewProjectDialog } from "@/components/projects/NewProjectDialog";
import { useToast } from "@/components/ui/use-toast";
import { sampleProjects, teamMembers } from "@/data/projectData";
import { Project, ProjectFile } from "@/types/project";
import { getCodeContent } from "@/utils/codeContentUtils";

const Projects = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>(sampleProjects);
  const [activeProject, setActiveProject] = useState<Project | null>(sampleProjects[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  const [fileContent, setFileContent] = useState<string>("");

  // Handler to set the active project
  const handleSelectProject = (project: Project) => {
    setActiveProject(project);
    setSelectedFile(null);
    setFileContent("");
  };

  // Handler for selecting a file to view
  const handleSelectFile = (file: ProjectFile) => {
    if (file.type === "file") {
      setSelectedFile(file);
      // Get file content from our utility function
      const content = getCodeContent(file.name);
      setFileContent(content || "// No content available for this file");
    }
  };

  // Handler for creating a new project
  const handleCreateProject = (newProject: {
    name: string;
    description: string;
    repository: string;
    technologies: string;
    teamMembers: string[];
  }) => {
    const projectId = `proj-${projects.length + 1}`;
    const createdProject = {
      id: projectId,
      name: newProject.name,
      description: newProject.description,
      progress: 0,
      repository: newProject.repository,
      technologies: newProject.technologies.split(",").map(tech => tech.trim()),
      team: newProject.teamMembers.map(memberId => {
        return teamMembers.find(member => member.id === memberId)!;
      }),
      lastUpdated: new Date().toISOString(),
      structure: [
        {
          id: `folder-${Date.now()}`,
          name: "src",
          type: "folder" as const,
          expanded: true,
          children: []
        }
      ]
    };

    setProjects([...projects, createdProject]);
    setActiveProject(createdProject);
    
    toast({
      title: "Project Created",
      description: `${newProject.name} has been created successfully.`,
    });
  };

  return (
    <div className="flex h-full flex-col space-y-4 p-8 md:flex-row md:space-x-4 md:space-y-0">
      <div className="md:w-1/3 lg:w-1/4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Projects</h2>
          <NewProjectDialog teamMembers={teamMembers} onCreateProject={handleCreateProject} />
        </div>
        
        <div className="relative mb-4">
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
          <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <ProjectList 
          projects={projects} 
          activeProject={activeProject} 
          searchQuery={searchQuery}
          onSelectProject={handleSelectProject} 
        />
      </div>
      
      {activeProject && (
        <div className="flex-1">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <ProjectDetail project={activeProject} />
            </TabsContent>
            
            <TabsContent value="files" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FolderTree className="mr-2 h-5 w-5" />
                    Project Structure
                  </CardTitle>
                  <CardDescription>
                    Browse through the project files and view their content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <ProjectFileExplorer 
                        files={activeProject.structure}
                        selectedFile={selectedFile}
                        onSelectFile={handleSelectFile}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <FileViewer 
                        selectedFile={selectedFile}
                        fileContent={fileContent}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="team" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Team Members
                  </CardTitle>
                  <CardDescription>
                    People contributing to this project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeProject.team.map((member) => (
                      <Card key={member.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-gray-500">{member.role}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Projects;
