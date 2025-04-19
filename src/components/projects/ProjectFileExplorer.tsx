
import { useState } from "react";
import { ChevronRight, ChevronDown, File, FolderClosed, FolderOpen } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProjectFile } from "@/types/project";

interface ProjectFileExplorerProps {
  files: ProjectFile[];
  selectedFile: ProjectFile | null;
  onSelectFile: (file: ProjectFile) => void;
}

export const ProjectFileExplorer = ({ files, selectedFile, onSelectFile }: ProjectFileExplorerProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>(() => {
    // Initialize with the expanded state from file data
    const initialState: Record<string, boolean> = {};
    const initializeExpanded = (fileList: ProjectFile[]) => {
      fileList.forEach(file => {
        if (file.type === "folder") {
          initialState[file.id] = file.expanded || false;
          if (file.children) {
            initializeExpanded(file.children);
          }
        }
      });
    };
    
    initializeExpanded(files);
    return initialState;
  });

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const getFileIcon = (file: ProjectFile) => {
    if (file.type === "folder") {
      return expandedFolders[file.id] ? <FolderOpen className="h-4 w-4" /> : <FolderClosed className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };

  const renderFileTree = (fileList: ProjectFile[], level = 0) => {
    return fileList.map((file) => (
      <div key={file.id}>
        <div 
          className={`flex items-center py-1 px-2 cursor-pointer text-sm rounded hover:bg-gray-100 ${
            selectedFile?.id === file.id ? "bg-gray-100" : ""
          }`}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() => {
            if (file.type === "folder") {
              toggleFolder(file.id);
            } else {
              onSelectFile(file);
            }
          }}
        >
          <div className="mr-1">
            {file.type === "folder" ? (
              expandedFolders[file.id] ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )
            ) : (
              <span className="w-4" /> // Spacer for alignment
            )}
          </div>
          <div className="mr-2 text-gray-500">{getFileIcon(file)}</div>
          <span>{file.name}</span>
          {file.size && <span className="ml-auto text-xs text-gray-400">{file.size}</span>}
        </div>
        
        {file.type === "folder" && expandedFolders[file.id] && file.children && (
          <div>{renderFileTree(file.children, level + 1)}</div>
        )}
      </div>
    ));
  };

  return (
    <ScrollArea className="h-[calc(100vh-320px)] border rounded-md p-2">
      {renderFileTree(files)}
    </ScrollArea>
  );
};
