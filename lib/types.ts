// Enums
export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

// User
export interface User {
  id: string;
  name?: string;
  email: string;
  image?: string;
  createdAt: string;

  teams?: TeamMember[];
  tasks?: Task[];
  meetings?: Meeting[];             // as attendee
  createdMeetings?: Meeting[];     // as creator
  createdEvents?: Event[];         // as creator
  ledTeams?: Team[];               // as leader

  sentInvitations?: TeamInvitation[];
  receivedInvitations?: TeamInvitation[];

  sentMessages?: Message[];
  chatMemberships?: ChatMember[];
}

// Team
export interface Team {
  id: string;
  name: string;
  createdAt: string;
  leaderId: string;

  leader?: User;
  members?: TeamMember[];
  projects?: Project[];
  TeamInvitation?: TeamInvitation[];
  chats?: Chat[];
}

// TeamMember (join table)
export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;

  user?: User;
  team?: Team;
}

// Project
export interface Project {
  id: string;
  title: string;
  description?: string;
  githubUrl?: string;
  teamId: string;

  team?: Team;
  tasks?: Task[];
}

// Task
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

// Meeting
export interface Meeting {
  id: string;
  topic: string;
  roomId: string;
  scheduled: string;
  createdBy: string;

  creator?: User;
  attendees?: User[];
}

// Event
export interface Event {
  id: string;
  title: string;
  description?: string;
  scheduledAt: string;
  createdById: string;

  creator?: User;
}

export enum InviteStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  invitedBy: string;  // inviter's userId
  invitedTo: string;  // invitee's userId
  status: InviteStatus;
  createdAt: string;

  team?: Team;
  inviter?: User;
  invitee?: User;
}

// Chat
export interface Chat {
  id: string;
  name?: string;
  isGroup: boolean;
  teamId?: string;
  createdAt: string;

  team?: Team;
  members?: ChatMember[];
  messages?: Message[];
}

// ChatMember (join table)
export interface ChatMember {
  id: string;
  chatId: string;
  userId: string;

  chat?: Chat;
  user?: User;
}

// Message
export interface Message {
  id: string;
  content: string;
  createdAt: string;
  chatId: string;
  senderId: string;

  chat?: Chat;
  sender?: User;
}
