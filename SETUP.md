# BrokerForce Setup Guide

Complete setup guide for BrokerForce development and production environments.

## Quick Start (Development)

Run the automated setup script:

```bash
./setup.sh
```

This script will:

- ✅ Check and install Node.js dependencies
- ✅ Install pnpm if needed
- ✅ Install all frontend and backend dependencies
- ✅ Set up environment files (.env.local and google-login-demo/.env)
- ✅ Install and configure PostgreSQL (if Homebrew is available)
- ✅ Create database and initialize schema
- ✅ Configure DATABASE_URL automatically

## Manual Setup

If you prefer manual setup or the script doesn't work:

### 1. Install Dependencies

```bash
# Install pnpm (if not installed)
npm install -g pnpm@8.10.0

# Install frontend dependencies
pnpm install

# Install backend dependencies
cd google-login-demo
npm install
cd ..
```

### 2. Set Up Environment Files

**Frontend** (`.env.local`):

```env
# Optional - Only if using SimplyRETS API
VITE_SIMPLYRETS_API_URL=https://api.simplyrets.com
VITE_SIMPLYRETS_API_KEY=your_api_key_here
VITE_SIMPLYRETS_SECRET=your_secret_here

# Optional - Override auth server URL (defaults to http://localhost:3001)
# VITE_AUTH_SERVER_URL=http://localhost:3001
```

**Backend** (`google-login-demo/.env`):

```env
# Google OAuth (Required for login to work)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-this-to-something-secure

# Server Configuration
PORT=3001
NODE_ENV=development

# URLs
BASE_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173

# Database Configuration
DATABASE_URL=postgresql://localhost:5432/brokerforce_dev

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-very-secure
JWT_EXPIRES_IN=7d
```

### 3. Set Up PostgreSQL

**Install PostgreSQL:**

```bash
# macOS (Homebrew)
brew install postgresql@14
brew services start postgresql@14

# Or use Postgres.app: https://postgresapp.com/
```

**Create Database:**

```bash
createdb brokerforce_dev
```

**Initialize Schema:**

```bash
cd google-login-demo
node db/init.js
```

### 4. Start Development Servers

```bash
./start-servers.sh
```

Or manually:

```bash
# Terminal 1 - Backend
cd google-login-demo
npm run dev

# Terminal 2 - Frontend
pnpm dev
```

## Google OAuth Setup

### Quick Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/Select a project
3. Enable "Google+ API" or "Google Identity" in APIs & Services > Library
4. Go to APIs & Services > Credentials
5. Click "Create Credentials" > "OAuth 2.0 Client ID"
6. Configure OAuth consent screen if prompted (External user type)
7. Set Application type: "Web application"
8. Add authorized redirect URIs:
   - Development: `http://localhost:3001/auth/google/callback`
   - Production: `https://your-auth-server-domain.com/auth/google/callback`
9. Copy Client ID and Client Secret
10. Add them to `google-login-demo/.env`:
    ```env
    GOOGLE_CLIENT_ID=your_client_id_here
    GOOGLE_CLIENT_SECRET=your_client_secret_here
    ```

See `GOOGLE_LOGIN_SETUP.md` for detailed step-by-step instructions.

## Production Deployment

### Prerequisites

1. PostgreSQL database (Railway/Heroku Postgres/Supabase)
2. Backend hosting (Railway/Heroku/Render)
3. Frontend hosting (Netlify/Vercel)

### Backend Deployment

**Required Environment Variables:**

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_secure_session_secret
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend-domain.com
BASE_URL=https://your-backend-domain.com
NODE_ENV=production
```

**Database Schema:**
After deploying, initialize the database schema:

```bash
# Railway
railway connect postgres < google-login-demo/db/schema.sql

# Heroku
heroku pg:psql < google-login-demo/db/schema.sql
```

### Frontend Deployment

**Required Environment Variables:**

```env
VITE_AUTH_SERVER_URL=https://your-backend-domain.com
```

See `PRE_DEPLOYMENT_CHECKLIST.md` for complete production setup instructions.

## Troubleshooting

### PostgreSQL Connection Errors

**Error**: `ECONNREFUSED` on port 5432

**Solution**:

```bash
# Start PostgreSQL
brew services start postgresql@14

# Verify it's running
pg_isready
```

### Database Schema Errors

**Error**: `relation "users" does not exist`

**Solution**:

```bash
cd google-login-demo
node db/init.js
```

### Missing Dependencies

**Error**: `Cannot find module 'cookie-parser'`

**Solution**:

```bash
cd google-login-demo
npm install
```

### OAuth Not Working

1. Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
2. Check redirect URI matches in Google Cloud Console
3. Ensure backend server is running
4. Check browser console for errors

## Documentation

- `SETUP.md` - This file (development setup)
- `PRE_DEPLOYMENT_CHECKLIST.md` - Production deployment checklist
- `POSTGRESQL_SETUP.md` - Detailed PostgreSQL setup guide
- `ENVIRONMENT_SETUP.md` - Environment variables and OAuth configuration
- `DEVELOPMENT.md` - Development workflow guide
- `README.md` - Project overview and features
