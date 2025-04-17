
# DevSyncSpace Backend

This is the backend server for the DevSyncSpace application, built with Node.js, Express, and MongoDB.

## Features

- Google OAuth authentication
- GitHub OAuth authentication
- JWT-based API authentication
- Project management
- Team collaboration
- Event scheduling with Google Calendar integration
- Real-time meeting functionality

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` and fill in your credentials
4. Start the development server:
   ```
   npm run dev
   ```

## Environment Variables

- `PORT`: Server port (default: 8000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `GOOGLE_CALLBACK_URL`: Google OAuth callback URL
- `GITHUB_CLIENT_ID`: GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET`: GitHub OAuth client secret
- `GITHUB_CALLBACK_URL`: GitHub OAuth callback URL
- `FRONTEND_URL`: Frontend application URL for CORS and redirects

## API Endpoints

### Authentication

- `GET /api/auth/google`: Initiate Google OAuth login
- `GET /api/auth/google/callback`: Google OAuth callback
- `GET /api/auth/github`: Initiate GitHub OAuth login
- `GET /api/auth/github/callback`: GitHub OAuth callback
- `GET /api/auth/me`: Get current user info
- `POST /api/auth/logout`: Logout user

### Projects

- `GET /api/projects`: Get all projects for current user
- `GET /api/projects/:id`: Get a specific project
- `POST /api/projects`: Create a new project
- `PUT /api/projects/:id`: Update a project
- `POST /api/projects/:id/team`: Add a team member to a project
- `DELETE /api/projects/:id`: Delete a project

### Events

- `GET /api/events`: Get all events for current user
- `POST /api/events`: Create a new event (optionally add to Google Calendar)
- `PATCH /api/events/:id/participation`: Update participation status
- `DELETE /api/events/:id`: Delete an event

### Meetings

- `GET /api/meetings`: Get all meetings for current user
- `GET /api/meetings/room/:roomId`: Get meeting by room ID
- `POST /api/meetings`: Create a new meeting
- `POST /api/meetings/join/:roomId`: Join a meeting
- `POST /api/meetings/leave/:roomId`: Leave a meeting
- `POST /api/meetings/:id/end`: End a meeting (host only)

## Authentication Flow

1. User clicks "Login with Google" or "Login with GitHub"
2. User is redirected to OAuth provider
3. After successful authentication, user is redirected back to the application
4. Backend generates a JWT token and redirects to frontend with the token
5. Frontend stores the token in localStorage and uses it for API requests
