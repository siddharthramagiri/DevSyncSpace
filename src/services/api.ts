
import { Project, Event, Meeting, User } from '@/types/project';

// API configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper for handling fetch errors
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API request failed');
  }
  return response.json();
};

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// API request headers with authentication
const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// API client
export const api = {
  // Auth endpoints
  auth: {
    // Get current user profile
    getMe: async (): Promise<User> => {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    // Logout the user
    logout: async (): Promise<{ message: string }> => {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
  },

  // Project endpoints
  projects: {
    // Get all projects
    getAll: async (): Promise<Project[]> => {
      const response = await fetch(`${API_URL}/api/projects`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    // Get a single project by ID
    getById: async (id: string): Promise<Project> => {
      const response = await fetch(`${API_URL}/api/projects/${id}`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    // Create a new project
    create: async (project: Partial<Project>): Promise<Project> => {
      const response = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(project),
      });
      return handleResponse(response);
    },

    // Update a project
    update: async (id: string, project: Partial<Project>): Promise<Project> => {
      const response = await fetch(`${API_URL}/api/projects/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(project),
      });
      return handleResponse(response);
    },

    // Add a team member to a project
    addTeamMember: async (
      projectId: string,
      userId: string,
      role: string
    ): Promise<Project> => {
      const response = await fetch(`${API_URL}/api/projects/${projectId}/team`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ userId, role }),
      });
      return handleResponse(response);
    },

    // Delete a project
    delete: async (id: string): Promise<{ message: string }> => {
      const response = await fetch(`${API_URL}/api/projects/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
  },

  // Event endpoints
  events: {
    // Get all events
    getAll: async (): Promise<Event[]> => {
      const response = await fetch(`${API_URL}/api/events`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    // Create a new event
    create: async (event: Partial<Event>): Promise<Event> => {
      const response = await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(event),
      });
      return handleResponse(response);
    },

    // Update participation status
    updateParticipation: async (
      eventId: string,
      status: 'accepted' | 'declined' | 'pending'
    ): Promise<Event> => {
      const response = await fetch(`${API_URL}/api/events/${eventId}/participation`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });
      return handleResponse(response);
    },

    // Delete an event
    delete: async (id: string): Promise<{ message: string }> => {
      const response = await fetch(`${API_URL}/api/events/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
  },

  // Meeting endpoints
  meetings: {
    // Get all meetings
    getAll: async (): Promise<Meeting[]> => {
      const response = await fetch(`${API_URL}/api/meetings`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    // Get a meeting by room ID
    getByRoomId: async (roomId: string): Promise<Meeting> => {
      const response = await fetch(`${API_URL}/api/meetings/room/${roomId}`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    // Create a new meeting
    create: async (meeting: Partial<Meeting>): Promise<Meeting> => {
      const response = await fetch(`${API_URL}/api/meetings`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(meeting),
      });
      return handleResponse(response);
    },

    // Join a meeting
    join: async (roomId: string): Promise<Meeting> => {
      const response = await fetch(`${API_URL}/api/meetings/join/${roomId}`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    // Leave a meeting
    leave: async (roomId: string): Promise<Meeting> => {
      const response = await fetch(`${API_URL}/api/meetings/leave/${roomId}`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    // End a meeting (host only)
    end: async (id: string): Promise<Meeting> => {
      const response = await fetch(`${API_URL}/api/meetings/${id}/end`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
  },
};

export default api;
