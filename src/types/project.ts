
export interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  repository: string;
  technologies: string[];
  team: TeamMember[];
  lastUpdated: string;
  structure: ProjectFile[];
  owner?: string | TeamMember;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  user?: string; // Reference to user ID from backend
  joinedAt?: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  type: "file" | "folder";
  extension?: string;
  size?: string;
  content?: string;
  children?: ProjectFile[];
  expanded?: boolean;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  roomId: string;
  startTime: string;
  endTime?: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  host: TeamMember | string;
  participants: MeetingParticipant[];
  project?: Project | string;
  recording?: {
    url: string;
    duration: number;
    available: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MeetingParticipant {
  user: TeamMember | string;
  joinTime?: string;
  leaveTime?: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  allDay: boolean;
  location?: string;
  organizer: TeamMember | string;
  participants: EventParticipant[];
  project?: Project | string;
  googleEventId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventParticipant {
  user: TeamMember | string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  provider: 'google' | 'github' | 'local';
  bio?: string;
  company?: string;
  jobTitle?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}
