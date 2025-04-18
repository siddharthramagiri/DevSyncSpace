
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Project } from "@/types/project";
import { useEffect, useState } from "react";
import { FileViewer } from "@/components/projects/FileViewer";
import { ProjectFileExplorer } from "@/components/projects/ProjectFileExplorer";

interface ProjectDetailProps {
  project: Project;
}

const ProjectDetail = ({ project }: ProjectDetailProps) => {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [fileContent, setFileContent] = useState("");
  const [backendUrl, setBackendUrl] = useState("");
  const [apiStatus, setApiStatus] = useState({ connected: false, message: "Not connected" });

  // When a project file is selected
  const handleFileSelect = (file: any) => {
    if (file.type === "file") {
      setSelectedFile(file);
      // Simulate getting file content based on file type
      const content = getFileContentSample(file.name, file.extension);
      setFileContent(content);
    }
  };

  // Check backend API connection
  const checkApiConnection = async () => {
    if (!backendUrl) return;
    
    try {
      setApiStatus({ connected: false, message: "Connecting..." });
      const response = await fetch(`${backendUrl}/api/status`);
      
      if (response.ok) {
        const data = await response.json();
        setApiStatus({ 
          connected: true, 
          message: `Connected to backend (${data.version})`
        });
      } else {
        setApiStatus({ 
          connected: false, 
          message: "Error connecting to backend API"
        });
      }
    } catch (error) {
      setApiStatus({ 
        connected: false, 
        message: "Connection failed. Check URL and server status."
      });
    }
  };

  // Sample function to generate placeholder file content
  const getFileContentSample = (name: string, extension?: string) => {
    if (extension === "js" || extension === "jsx" || extension === "ts" || extension === "tsx") {
      return `// ${name}\n\nimport { useState } from 'react';\n\nconst Component = () => {\n  const [data, setData] = useState();\n\n  return (\n    <div>\n      <h1>Component Content</h1>\n    </div>\n  );\n};\n\nexport default Component;`;
    } else if (extension === "json") {
      return `{\n  "name": "${project.name}",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.0.0",\n    "express": "^4.18.2"\n  }\n}`;
    } else if (extension === "css" || extension === "scss") {
      return `.container {\n  display: flex;\n  flex-direction: column;\n  padding: 1rem;\n}\n\n.header {\n  font-size: 1.5rem;\n  font-weight: bold;\n  margin-bottom: 1rem;\n}`;
    } else if (extension === "md") {
      return `# ${project.name}\n\n## Overview\n\nThis project is a ${project.description}.\n\n## Technologies\n\n${project.technologies.join(", ")}`;
    } else {
      return `This is a sample content for ${name}`;
    }
  };

  useEffect(() => {
    if (backendUrl) {
      checkApiConnection();
    }
  }, [backendUrl]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between py-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
      </div>
      <Tabs defaultValue="files" className="flex-1 flex flex-col">
        <TabsList>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="backend">Backend API</TabsTrigger>
        </TabsList>
        <TabsContent value="files" className="flex-1 flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
            <div className="md:col-span-1 overflow-hidden border rounded-md">
              <ProjectFileExplorer
                files={project.structure}
                selectedFile={selectedFile}
                onSelectFile={handleFileSelect}
              />
            </div>
            <div className="md:col-span-2">
              <FileViewer selectedFile={selectedFile} fileContent={fileContent} />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <div className="space-y-4 py-2 pb-4">
            <div>
              <h3 className="text-lg font-medium">Project Settings</h3>
              <p className="text-sm text-muted-foreground">
                Manage your project configuration and team access
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Repository URL</h4>
              <Input value={project.repository} readOnly />
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Team Members</h4>
              <div className="space-y-2">
                {project.team.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gray-200" />
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm">
                Add Team Member
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="backend" className="space-y-4 py-2 pb-4">
          <div>
            <h3 className="text-lg font-medium">Backend API Configuration</h3>
            <p className="text-sm text-muted-foreground">
              Connect your project to a backend API server
            </p>
          </div>
          <Separator />
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">API Base URL</h4>
              <div className="flex space-x-2">
                <Input 
                  placeholder="http://localhost:8000" 
                  value={backendUrl}
                  onChange={(e) => setBackendUrl(e.target.value)}
                />
                <Button onClick={checkApiConnection}>Connect</Button>
              </div>
              <p className={`text-sm ${apiStatus.connected ? 'text-green-500' : 'text-red-500'}`}>
                Status: {apiStatus.message}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">API Resources</h4>
              <div className="border rounded-md p-4 space-y-2">
                <p className="text-sm">Available endpoints:</p>
                <ul className="text-sm space-y-1 pl-5 list-disc">
                  <li>GET /api/status</li>
                  <li>GET /api/projects</li>
                  <li>POST /api/auth/google</li>
                  <li>POST /api/auth/github</li>
                  <li>GET /api/events</li>
                  <li>POST /api/meetings</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetail;
