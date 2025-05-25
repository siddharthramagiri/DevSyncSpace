
import { Search } from "lucide-react";
import { Project } from "@/types/project";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProjectListProps {
  projects: Project[];
  activeProject: Project | null;
  searchQuery: string;
  onSelectProject: (project: Project) => void;
}

export const ProjectList = ({ 
  projects, 
  activeProject, 
  searchQuery, 
  onSelectProject 
}: ProjectListProps) => {
  // Filter projects based on search query
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-3">
      {filteredProjects.length === 0 ? (
        <div className="text-center py-10">
          <Search className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">No projects found matching your search</p>
        </div>
      ) : (
        filteredProjects.map((project) => (
          <Card 
            key={project.id}
            className={`cursor-pointer transition-colors ${
              activeProject?.id === project.id 
                ? "border-primary" 
                : "hover:border-gray-300"
            }`}
            onClick={() => onSelectProject(project)}
          >
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{project.name}</h3>
                  <Badge variant="outline">{project.progress}%</Badge>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {project.technologies.slice(0, 3).map((tech, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{project.technologies.length - 3}
                    </Badge>
                  )}
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500 pt-2">
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 3).map((member) => (
                      <div key={member.id} className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px]">
                        {member.name.charAt(0)}
                      </div>
                    ))}
                    {project.team.length > 3 && (
                      <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px]">
                        +{project.team.length - 3}
                      </div>
                    )}
                  </div>
                  <span>
                    Updated {formatDistanceToNow(new Date(project.lastUpdated), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
