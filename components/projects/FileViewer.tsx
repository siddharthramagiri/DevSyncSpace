
import { ProjectFile } from "@/types/project";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";

interface FileViewerProps {
  selectedFile: ProjectFile | null;
  fileContent: string;
}

export const FileViewer = ({ selectedFile, fileContent }: FileViewerProps) => {
  const [highlightedContent, setHighlightedContent] = useState<string | JSX.Element>("");

  useEffect(() => {
    if (selectedFile) {
      setHighlightedContent(getHighlightedContent(selectedFile, fileContent));
    }
  }, [selectedFile, fileContent]);

  if (!selectedFile) {
    return (
      <div className="h-[calc(100vh-320px)] border rounded-md p-4 flex items-center justify-center text-gray-500">
        Select a file to view its content
      </div>
    );
  }

  // Simple syntax highlighter based on file extension
  function getHighlightedContent(file: ProjectFile, content: string) {
    if (!content) return <pre className="text-gray-700">No content available</pre>;
    
    const extension = file.extension?.toLowerCase();
    
    // For a real app, use libraries like Prism or highlight.js for proper syntax highlighting
    if (extension === "json") {
      try {
        const jsonObj = JSON.parse(content);
        return (
          <pre className="text-sm font-mono whitespace-pre-wrap text-green-700">
            {JSON.stringify(jsonObj, null, 2)}
          </pre>
        );
      } catch {
        return <pre className="text-sm font-mono whitespace-pre-wrap">{content}</pre>;
      }
    } else if (extension === "js" || extension === "jsx" || extension === "ts" || extension === "tsx") {
      // Very basic highlighting for JS/TS
      return (
        <pre className="text-sm font-mono whitespace-pre-wrap">
          {content.replace(
            /(import|export|from|const|let|var|function|return|if|else|for|while|class|extends|=>|async|await)/g,
            '<span class="text-purple-600">$1</span>'
          )}
        </pre>
      );
    } else if (extension === "html" || extension === "xml") {
      // Very basic highlighting for HTML/XML
      return (
        <pre className="text-sm font-mono whitespace-pre-wrap">
          {content.replace(
            /(&lt;[^&]*&gt;)/g,
            '<span class="text-blue-600">$1</span>'
          )}
        </pre>
      );
    } else if (extension === "css" || extension === "scss") {
      // Very basic highlighting for CSS
      return (
        <pre className="text-sm font-mono whitespace-pre-wrap">
          {content.replace(
            /(\.[\w-]+|\#[\w-]+)/g,
            '<span class="text-blue-600">$1</span>'
          )}
        </pre>
      );
    } else if (extension === "md") {
      // Very basic highlighting for Markdown
      return (
        <div className="prose prose-sm max-w-none p-2 text-gray-700">
          {content.split('\n').map((line, index) => {
            if (line.startsWith('# ')) {
              return <h1 key={index} className="text-xl font-bold mt-4">{line.substring(2)}</h1>;
            } else if (line.startsWith('## ')) {
              return <h2 key={index} className="text-lg font-bold mt-3">{line.substring(3)}</h2>;
            } else if (line.startsWith('### ')) {
              return <h3 key={index} className="text-md font-bold mt-2">{line.substring(4)}</h3>;
            } else if (line.startsWith('- ')) {
              return <li key={index} className="ml-4">{line.substring(2)}</li>;
            } else {
              return <p key={index} className="my-1">{line}</p>;
            }
          })}
        </div>
      );
    } else {
      return <pre className="text-sm font-mono whitespace-pre-wrap">{content}</pre>;
    }
  }

  return (
    <div className="h-[calc(100vh-320px)] border rounded-md overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b">
        <div className="flex items-center justify-between">
          <div className="font-medium">{selectedFile.name}</div>
          {selectedFile.size && <div className="text-xs text-gray-500">{selectedFile.size}</div>}
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-370px)] p-4">
        <div dangerouslySetInnerHTML={{ __html: highlightedContent as string }} />
      </ScrollArea>
    </div>
  );
};
