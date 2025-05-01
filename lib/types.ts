// lib/types.ts

export interface User {
    id: string;
    name?: string;
    email: string;
    image?: string;
    createdAt: string;
  
    teams?: TeamMember[];
    tasks?: Task[];
    meetings?: Meeting[];
    Meeting?: Meeting[];
    Team?: Team[];
    Event?: Event[];
  }
  
  export interface Team {
    id: string;
    name: string;
    createdAt: string;
    leaderId: string;
    leader?: User;
  
    members?: TeamMember[];
    projects?: Project[];
  }
  
  export interface TeamMember {
    id: string;
    userId: string;
    teamId: string;
  
    user?: User;
    team?: Team;
  }
  
  export interface Project {
    id: string;
    title: string;
    description?: string;
    githubUrl?: string;
    teamId: string;
  
    team?: Team;
    tasks?: Task[];
  }
  
  export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    dueDate?: string;
  
    projectId: string;
    assignedToId?: string;
  
    project?: Project;
    assignedTo?: User;
  }
  
  export interface Meeting {
    id: string;
    topic: string;
    roomId: string;
    scheduled: string;
    createdBy: string;
  
    creator?: User;
    attendees?: User[];
  }
  
  export interface Event {
    id: string;
    title: string;
    description?: string;
    scheduledAt: string;
    createdById: string;
  
    creator?: User;
  }
  
  export enum TaskStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED"
  }
  