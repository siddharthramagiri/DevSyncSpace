'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar as CalendarIcon, CheckCircle2, CircleSlash, Clock, MenuIcon, Plus, ChevronDown, Filter, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

// Task types
interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "completed";
  priority: "low" | "medium" | "high";
  assignee: {
    id: string;
    name: string;
    avatar?: string;
  };
  dueDate: string;
  created: string;
  tags: string[];
  project: string;
}

// Sample data
const sampleTasks: Task[] = [
  {
    id: "task-1",
    title: "Implement user authentication",
    description: "Create login and registration forms, set up JWT authentication, and integrate with the backend API.",
    status: "completed",
    priority: "high",
    assignee: {
      id: "user-1",
      name: "Alex Johnson",
    },
    dueDate: "2023-10-15",
    created: "2023-10-01",
    tags: ["frontend", "auth"],
    project: "E-commerce Platform",
  },
  {
    id: "task-2",
    title: "Design product detail page",
    description: "Create wireframes and high-fidelity designs for the product detail page. Include image gallery, specifications, and related products.",
    status: "review",
    priority: "medium",
    assignee: {
      id: "user-2",
      name: "Taylor Kim",
    },
    dueDate: "2023-10-18",
    created: "2023-10-05",
    tags: ["design", "ui"],
    project: "E-commerce Platform",
  },
  {
    id: "task-3",
    title: "Optimize database queries",
    description: "Analyze slow queries and implement optimizations to improve performance. Add necessary indexes and refactor problematic SQL statements.",
    status: "in-progress",
    priority: "high",
    assignee: {
      id: "user-3",
      name: "Jordan Chen",
    },
    dueDate: "2023-10-20",
    created: "2023-10-08",
    tags: ["backend", "database"],
    project: "Mobile Banking App",
  },
  {
    id: "task-4",
    title: "Implement checkout flow",
    description: "Create multi-step checkout process with address form, payment integration, and order confirmation.",
    status: "todo",
    priority: "medium",
    assignee: {
      id: "user-1",
      name: "Alex Johnson",
    },
    dueDate: "2023-10-25",
    created: "2023-10-10",
    tags: ["frontend", "payment"],
    project: "E-commerce Platform",
  },
  {
    id: "task-5",
    title: "Add unit tests for API endpoints",
    description: "Write comprehensive tests for all API endpoints to ensure proper functionality and prevent regressions.",
    status: "todo",
    priority: "low",
    assignee: {
      id: "user-3",
      name: "Jordan Chen",
    },
    dueDate: "2023-10-30",
    created: "2023-10-12",
    tags: ["backend", "testing"],
    project: "Mobile Banking App",
  },
  {
    id: "task-6",
    title: "Implement dark mode",
    description: "Add dark mode theme toggle and ensure all components support both light and dark themes consistently.",
    status: "in-progress",
    priority: "low",
    assignee: {
      id: "user-2",
      name: "Taylor Kim",
    },
    dueDate: "2023-11-05",
    created: "2023-10-15",
    tags: ["frontend", "ui"],
    project: "Mobile Banking App",
  },
];

// Team members for assignee selection
const teamMembers = [
  { id: "user-1", name: "Alex Johnson" },
  { id: "user-2", name: "Taylor Kim" },
  { id: "user-3", name: "Jordan Chen" },
  { id: "user-4", name: "Mira Patel" },
  { id: "user-5", name: "Sam Rodriguez" },
];

// Projects for project selection
const projects = [
  "E-commerce Platform",
  "Mobile Banking App",
  "Analytics Dashboard",
];

const Tasks = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    assignee: { id: "", name: "" },
    dueDate: "",
    tags: [],
    project: "",
  });
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [currentView, setCurrentView] = useState("board");
  const [viewByStatus, setViewByStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [tagInput, setTagInput] = useState("");

  // Filter tasks based on view and search
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = viewByStatus === "all" || task.status === viewByStatus;
    const matchesSearch = 
      searchQuery === "" || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.assignee?.id || !newTask.project) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingTask(true);
    
    // Simulate task creation
    setTimeout(() => {
      const createdTask: Task = {
        id: `task-${Date.now()}`,
        title: newTask.title!,
        description: newTask.description || "",
        status: newTask.status as "todo" | "in-progress" | "review" | "completed",
        priority: newTask.priority as "low" | "medium" | "high",
        assignee: {
          id: newTask.assignee?.id!,
          name: newTask.assignee?.name!,
        },
        dueDate: newTask.dueDate || new Date().toISOString().split("T")[0],
        created: new Date().toISOString().split("T")[0],
        tags: newTask.tags || [],
        project: newTask.project!,
      };

      setTasks([createdTask, ...tasks]);
      setNewTask({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        assignee: { id: "", name: "" },
        dueDate: "",
        tags: [],
        project: "",
      });
      setIsCreatingTask(false);
      setTagInput("");
      
      toast({
        title: "Task created",
        description: "Your new task has been created successfully.",
      });
    }, 1000);
  };

  const handleAddTag = () => {
    if (tagInput.trim() === "") return;
    
    setNewTask({
      ...newTask,
      tags: [...(newTask.tags || []), tagInput.trim()],
    });
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewTask({
      ...newTask,
      tags: (newTask.tags || []).filter(tag => tag !== tagToRemove),
    });
  };

  const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    
    toast({
      title: "Task updated",
      description: `Task status changed to ${newStatus.replace("-", " ")}`,
    });
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    toast({
      title: "Task deleted",
      description: "The task has been deleted",
    });
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-orange-500";
      case "low":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "review":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "todo":
        return <CircleSlash className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  // Rendered components for different views
  const renderBoardView = () => {
    const columns = [
      { id: "todo", title: "To Do" },
      { id: "in-progress", title: "In Progress" },
      { id: "review", title: "In Review" },
      { id: "completed", title: "Completed" },
    ];

    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 m-5">
        <h1>Hello</h1>
        {columns.map((column) => {
          const columnTasks = filteredTasks.filter(
            (task) => task.status === column.id
          );

          return (
            <div key={column.id} className="flex flex-col">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold">{column.title}</h3>
                  <Badge className="ml-2 bg-gray-200 text-gray-800">
                    {columnTasks.length}
                  </Badge>
                </div>
                {column.id === "todo" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Create New Task</DialogTitle>
                        <DialogDescription>
                          Fill in the details to create a new task.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            placeholder="Task title"
                            value={newTask.title}
                            onChange={(e) =>
                              setNewTask({ ...newTask, title: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            placeholder="Task description"
                            value={newTask.description}
                            onChange={(e) =>
                              setNewTask({ ...newTask, description: e.target.value })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                              onValueChange={(value) =>
                                setNewTask({
                                  ...newTask,
                                  priority: value as Task["priority"],
                                })
                              }
                              defaultValue={newTask.priority}
                            >
                              <SelectTrigger id="priority">
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="assignee">Assignee</Label>
                            <Select
                              onValueChange={(value) => {
                                const member = teamMembers.find(m => m.id === value);
                                if (member) {
                                  setNewTask({
                                    ...newTask,
                                    assignee: {
                                      id: member.id,
                                      name: member.name,
                                    },
                                  });
                                }
                              }}
                            >
                              <SelectTrigger id="assignee">
                                <SelectValue placeholder="Assign to..." />
                              </SelectTrigger>
                              <SelectContent>
                                {teamMembers.map((member) => (
                                  <SelectItem key={member.id} value={member.id}>
                                    {member.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="dueDate">Due Date</Label>
                            <Input
                              id="dueDate"
                              type="date"
                              value={newTask.dueDate}
                              onChange={(e) =>
                                setNewTask({ ...newTask, dueDate: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="project">Project</Label>
                            <Select
                              onValueChange={(value) =>
                                setNewTask({ ...newTask, project: value })
                              }
                            >
                              <SelectTrigger id="project">
                                <SelectValue placeholder="Select project" />
                              </SelectTrigger>
                              <SelectContent>
                                {projects.map((project) => (
                                  <SelectItem key={project} value={project}>
                                    {project}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Tags</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              placeholder="Add a tag..."
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddTag();
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleAddTag}
                            >
                              Add
                            </Button>
                          </div>
                          {newTask.tags && newTask.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {newTask.tags.map((tag) => (
                                <Badge key={tag} className="flex items-center gap-1 bg-secondary text-secondary-foreground">
                                  {tag}
                                  <button
                                    type="button"
                                    className="ml-1 text-xs"
                                    onClick={() => handleRemoveTag(tag)}
                                  >
                                    ×
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => {
                          setNewTask({
                            title: "",
                            description: "",
                            status: "todo",
                            priority: "medium",
                            assignee: { id: "", name: "" },
                            dueDate: "",
                            tags: [],
                            project: "",
                          });
                          setTagInput("");
                        }}>
                          Cancel
                        </Button>
                        <Button type="button" onClick={handleCreateTask} disabled={isCreatingTask}>
                          {isCreatingTask ? "Creating..." : "Create Task"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="space-y-3 pr-3">
                  {columnTasks.length > 0 ? (
                    columnTasks.map((task) => (
                      <Card key={task.id} className="cursor-pointer hover:shadow-md">
                        <CardHeader className="p-4 pb-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-base">{task.title}</CardTitle>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => toast({ title: "Edit Task", description: "This would open the edit dialog" })}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => deleteTask(task.id)}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                            {task.description}
                          </div>
                          {task.tags.length > 0 && (
                            <div className="mb-3 flex flex-wrap gap-1">
                              {task.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <div
                                className={cn(
                                  "mr-1.5 h-2 w-2 rounded-full",
                                  getPriorityColor(task.priority)
                                )}
                              />
                              <span className="capitalize">{task.priority}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <CalendarIcon className="mr-1 h-3.5 w-3.5" />
                              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>
                                  {task.assignee.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="ml-1.5 text-xs">{task.assignee.name}</span>
                            </div>
                            {column.id !== "todo" && (
                              <Select
                                defaultValue={task.status}
                                onValueChange={(value) => handleStatusChange(task.id, value as Task["status"])}
                              >
                                <SelectTrigger className="h-7 w-[130px] border-none text-xs shadow-none">
                                  <div className="flex items-center">
                                    {getStatusIcon(task.status)}
                                    <span className="ml-1.5 capitalize">
                                      {task.status.replace("-", " ")}
                                    </span>
                                  </div>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="todo">To Do</SelectItem>
                                  <SelectItem value="in-progress">In Progress</SelectItem>
                                  <SelectItem value="review">In Review</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="rounded-lg border border-dashed p-8 text-center">
                      <p className="text-sm text-muted-foreground">No tasks in this column</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          );
        })}
      </div>
    );
  };

  const renderListView = () => {
    return (
      // <></>
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md">
            <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 text-sm font-medium">
              <div className="col-span-5">Task</div>
              <div className="col-span-2">Assignee</div>
              <div className="col-span-1">Priority</div>
              <div className="col-span-2">Due Date</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            {filteredTasks.length > 0 ? (
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <div className="divide-y">
                  {filteredTasks.map((task) => (
                    <div key={task.id} className="grid grid-cols-12 gap-4 p-4">
                      <div className="col-span-5">
                        <div className="font-medium">{task.title}</div>
                        <div className="line-clamp-1 text-sm text-muted-foreground">
                          {task.description}
                        </div>
                        {task.tags.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {task.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="col-span-2 flex items-center">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="ml-2 text-sm">{task.assignee.name}</span>
                      </div>
                      <div className="col-span-1 flex items-center">
                        <div
                          className={cn(
                            "mr-1.5 h-2 w-2 rounded-full",
                            getPriorityColor(task.priority)
                          )}
                        />
                        <span className="text-sm capitalize">{task.priority}</span>
                      </div>
                      <div className="col-span-2 flex items-center text-sm">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                      <div className="col-span-1 flex items-center">
                        <Select
                          defaultValue={task.status}
                          onValueChange={(value) => handleStatusChange(task.id, value as Task["status"])}
                        >
                          <SelectTrigger className="h-8 border-none text-xs shadow-none">
                            <div className="flex items-center">
                              {getStatusIcon(task.status)}
                              <span className="ml-1.5 capitalize">
                                {task.status.replace("-", " ")}
                              </span>
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todo">To Do</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="review">In Review</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-1 flex items-center justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toast({ title: "Edit Task", description: "This would open the edit dialog" })}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => deleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">No tasks found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 m-5">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Manage and track your team's tasks.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new task.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Task description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    onValueChange={(value) =>
                      setNewTask({
                        ...newTask,
                        priority: value as Task["priority"],
                      })
                    }
                    defaultValue={newTask.priority}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Select
                    onValueChange={(value) => {
                      const member = teamMembers.find(m => m.id === value);
                      if (member) {
                        setNewTask({
                          ...newTask,
                          assignee: {
                            id: member.id,
                            name: member.name,
                          },
                        });
                      }
                    }}
                  >
                    <SelectTrigger id="assignee">
                      <SelectValue placeholder="Assign to..." />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) =>
                      setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project">Project</Label>
                  <Select
                    onValueChange={(value) =>
                      setNewTask({ ...newTask, project: value })
                    }
                  >
                    <SelectTrigger id="project">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project} value={project}>
                          {project}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Add a tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTag}
                  >
                    Add
                  </Button>
                </div>
                {newTask.tags && newTask.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {newTask.tags.map((tag) => (
                      <Badge key={tag} className="flex items-center gap-1 bg-secondary text-secondary-foreground">
                        {tag}
                        <button
                          type="button"
                          className="ml-1 text-xs"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                setNewTask({
                  title: "",
                  description: "",
                  status: "todo",
                  priority: "medium",
                  assignee: { id: "", name: "" },
                  dueDate: "",
                  tags: [],
                  project: "",
                });
                setTagInput("");
              }}>
                Cancel
              </Button>
              <Button type="button" onClick={handleCreateTask} disabled={isCreatingTask}>
                {isCreatingTask ? "Creating..." : "Create Task"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex flex-wrap items-center gap-2">
          <Tabs
            defaultValue="board"
            value={currentView}
            onValueChange={setCurrentView}
            className="w-[200px]"
          >
            <TabsList>
              <TabsTrigger value="board">Board</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Select
            defaultValue="all"
            value={viewByStatus}
            onValueChange={setViewByStatus}
          >
            <SelectTrigger className="h-9 w-[180px]">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                {viewByStatus === "all" ? "All Tasks" : viewByStatus.replace("-", " ")}
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="review">In Review</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* <TabsContent value="board" className="mt-0 border-none p-0">
        {renderBoardView()}
      </TabsContent> */}
      
      {/* <TabsContent value="list" className="mt-0 border-none p-0">
        {renderListView()}
      </TabsContent> */}
    </div>
  );
};

export default Tasks;
