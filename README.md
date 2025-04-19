Add .env

PORT=8000
MONGODB_URI={`DB_Url_String`}
JWT_SECRET={`Jwt_token`}

# Google OAuth
GOOGLE_CLIENT_ID={`google_client_id`}
GOOGLE_CLIENT_SECRET={`Client_secret`}
GOOGLE_CALLBACK_URL=http://localhost:8000/api/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID={`Github_Client_id`}
GITHUB_CALLBACK_URL=http://localhost:8000/api/auth/github/callback

# Frontend URL for redirects
FRONTEND_URL=http://localhost:8081

