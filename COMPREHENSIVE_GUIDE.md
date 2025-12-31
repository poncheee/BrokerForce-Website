# BrokerForce Comprehensive Guide

This guide consolidates all setup, deployment, troubleshooting, and configuration information for the BrokerForce platform.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Environment Setup](#environment-setup)
3. [Database Configuration](#database-configuration)
4. [Authentication Setup](#authentication-setup)
5. [Deployment Guide](#deployment-guide)
6. [Troubleshooting](#troubleshooting)
7. [Common Fixes](#common-fixes)
8. [Environment Variables Reference](#environment-variables-reference)
9. [Architecture Overview](#architecture-overview)

---

## Quick Start

### Local Development Setup

1. **Clone and Install:**

   ```bash
   git clone <repository-url>
   cd BrokerForce-Website-2
   ./setup.sh
   ```

2. **Start Development Servers:**

   ```bash
   ./start-servers.sh
   ```

3. **Access the Application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

### Production Deployment

- **Frontend**: Deploy to Netlify (`brokerforce.ai`)
- **Backend**: Deploy to Railway (API server)
- **Database**: PostgreSQL on Supabase

See [Deployment Guide](#deployment-guide) for detailed instructions.

---

## Environment Setup

### Required Software

- **Node.js**: v18 or higher
- **PostgreSQL**: 12+ (or use Supabase)
- **npm** or **pnpm**: Package manager
- **Git**: Version control

### Project Structure

```
BrokerForce-Website-2/
├── src/                    # Frontend React application
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── services/         # API service layer
│   └── hooks/            # Custom React hooks
├── google-login-demo/     # Backend Express server
│   ├── routes/           # API routes
│   ├── db/               # Database schemas
│   └── server.js         # Main server file
└── public/               # Static assets
```

---

## Database Configuration

### Option 1: Supabase (Recommended for Production)

1. **Create Supabase Project:**

   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for database to initialize

2. **Get Connection String:**

   - Go to Project Settings → Database
   - Copy the connection string
   - Use the **Connection pooling** URL (port 6543) for better performance
   - Format: `postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true`

3. **Set Environment Variable:**

   ```env
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true
   ```

4. **Database Schema:**
   - Schema is automatically initialized on server startup
   - Located in: `google-login-demo/db/schema.sql`
   - Migrations in: `google-login-demo/db/migrate_add_username_password.sql`

### Option 2: Local PostgreSQL

1. **Install PostgreSQL:**

   ```bash
   # macOS
   brew install postgresql
   brew services start postgresql

   # Linux
   sudo apt-get install postgresql
   sudo systemctl start postgresql
   ```

2. **Create Database:**

   ```bash
   createdb brokerforce_dev
   ```

3. **Set Connection String:**
   ```env
   DATABASE_URL=postgresql://localhost:5432/brokerforce_dev
   ```

### Database Schema

The database includes the following tables:

- `users` - User accounts (Google OAuth + username/password)
- `user_favorites` - Saved properties
- `purchase_requests` - Property purchase requests
- `offers` - Property offers
- `documents` - Legal documents
- `payments` - Payment records

---

## Authentication Setup

### Google OAuth 2.0 Configuration

1. **Create Google Cloud Project:**

   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Google+ API

2. **Create OAuth Credentials:**

   - Go to APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "BrokerForce"

3. **Configure Authorized Origins:**

   - **Production**: `https://brokerforce.ai`
   - **Development**: `http://localhost:5173`

4. **Configure Authorized Redirect URIs:**

   - **Production**: `https://[YOUR_RAILWAY_URL]/auth/google/callback`
   - **Development**: `http://localhost:3001/auth/google/callback`
   - Example: `https://brokerforce-website-production-a631.up.railway.app/auth/google/callback`

5. **Get Credentials:**
   - Copy the Client ID and Client Secret
   - Add to environment variables (see below)

### Local Username/Password Authentication

The application also supports local authentication:

- Users can register with username and password
- Passwords are hashed using bcrypt
- Google OAuth accounts can be linked with local accounts

---

## Deployment Guide

### Architecture (Production)

**Standard Setup:**

- **Frontend**: `brokerforce.ai` → Netlify
- **Backend**: Railway URL → Railway
- **Database**: Supabase PostgreSQL

### Netlify Deployment (Frontend)

1. **Connect Repository:**

   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to your GitHub repository

2. **Build Settings:**

   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
   - Node version: 18

3. **Environment Variables:**

   ```env
   VITE_AUTH_SERVER_URL=https://[YOUR_RAILWAY_URL]
   ```

4. **Custom Domain:**
   - Go to Site settings → Domain management
   - Add custom domain: `brokerforce.ai`
   - Follow DNS configuration instructions

### Railway Deployment (Backend)

1. **Create Railway Project:**

   - Go to [railway.app](https://railway.app)
   - Create new project
   - Connect GitHub repository

2. **Service Configuration:**

   - Root Directory: `google-login-demo`
   - Start Command: `node server.js`
   - Build Command: (leave empty, or `npm install`)

3. **Environment Variables:**

   ```env
   NODE_ENV=production
   BASE_URL=https://[YOUR_RAILWAY_URL]
   FRONTEND_URL=https://brokerforce.ai
   PORT=3001
   GOOGLE_CLIENT_ID=[YOUR_CLIENT_ID]
   GOOGLE_CLIENT_SECRET=[YOUR_CLIENT_SECRET]
   SESSION_SECRET=[GENERATE_SECURE_RANDOM_STRING]
   JWT_SECRET=[GENERATE_SECURE_RANDOM_STRING]
   JWT_EXPIRES_IN=7d
   DATABASE_URL=[YOUR_SUPABASE_CONNECTION_STRING]
   ```

4. **Generate Secrets:**

   ```bash
   # Generate SESSION_SECRET
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

   # Generate JWT_SECRET
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. **Get Railway URL:**
   - After deployment, Railway provides a URL
   - Format: `https://[project-name].up.railway.app`
   - Use this URL in Google OAuth redirect URIs

### Post-Deployment Checklist

- [ ] Frontend deployed to Netlify
- [ ] Backend deployed to Railway
- [ ] Database connected (Supabase)
- [ ] Environment variables set correctly
- [ ] Google OAuth configured with correct URLs
- [ ] Custom domain configured (`brokerforce.ai`)
- [ ] SSL/HTTPS working (automatic on Netlify/Railway)
- [ ] Health check endpoint working: `[RAILWAY_URL]/health`
- [ ] Test login flow end-to-end
- [ ] Test API endpoints from frontend

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Errors

**Error**: `Connection refused` or `ECONNREFUSED`

**Solutions:**

- Verify `DATABASE_URL` is correct
- Check if database is running (local) or accessible (Supabase)
- For Supabase: Use connection pooling URL (port 6543)
- Check firewall settings
- Verify credentials are correct

#### 2. Google OAuth Redirect Mismatch

**Error**: `redirect_uri_mismatch`

**Solutions:**

- Ensure redirect URI in Google Console matches exactly:
  - Must be: `https://[RAILWAY_URL]/auth/google/callback`
  - Not: `https://brokerforce.ai/auth/google/callback` (frontend domain)
- Check for trailing slashes
- Verify protocol (http vs https)

#### 3. CORS Errors

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solutions:**

- Verify `FRONTEND_URL` in Railway matches your frontend domain
- Check `google-login-demo/server.js` CORS configuration
- Ensure credentials are included in fetch requests
- Check that backend allows your frontend origin

#### 4. Session/Cookie Issues

**Error**: Session not persisting after login

**Solutions:**

- Verify `cookieSecure` is `true` in production (HTTPS required)
- Check `cookieSameSite` setting (`none` for cross-origin)
- Ensure `trust proxy` is enabled: `app.set('trust proxy', 1)`
- Check that cookies are sent with requests (`credentials: 'include'`)

#### 5. Build Failures on Netlify

**Error**: `pnpm lockfile outdated` or build failures

**Solutions:**

- Use `npm` instead of `pnpm` in `netlify.toml`
- Remove `packageManager` field from `package.json`
- Ensure `package-lock.json` is up to date
- Check build logs for specific errors

#### 6. Missing Module/Import Errors

**Error**: `Cannot find module` or `X is not defined`

**Solutions:**

- Verify all imports are correct
- Check that components are exported properly
- Run `npm install` to ensure dependencies are installed
- Clear build cache and rebuild

#### 7. Port Already in Use

**Error**: `Port 3001 already in use`

**Solutions:**

- Find and kill the process using the port:
  ```bash
  # macOS/Linux
  lsof -ti:3001 | xargs kill -9
  ```
- Or change the port in `.env` file

---

## Common Fixes

### Fix Database Connection

1. **Verify Connection String:**

   ```bash
   # Test connection
   psql "[DATABASE_URL]"
   ```

2. **Check Environment Variables:**

   - Ensure `DATABASE_URL` is set correctly
   - No extra quotes or spaces
   - URL encoded if needed

3. **Restart Server:**
   ```bash
   # Kill existing process
   pkill -f "node server.js"
   # Restart
   cd google-login-demo && npm run dev
   ```

### Fix OAuth Redirect

1. **Update Google Console:**

   - Go to Google Cloud Console → Credentials
   - Edit OAuth 2.0 Client ID
   - Add correct redirect URI (Railway backend URL)

2. **Update Environment Variables:**

   - Verify `BASE_URL` in Railway matches Google redirect URI
   - Ensure `FRONTEND_URL` points to frontend domain

3. **Test Flow:**
   - Try login from frontend
   - Check browser console for errors
   - Verify redirect goes to Railway, not frontend

### Fix Missing Imports

If you see "X is not defined" errors:

1. **Check Import Statement:**

   ```typescript
   // Correct
   import Header from "@/components/Header";
   import { Link } from "react-router-dom";
   import { Home } from "lucide-react";
   ```

2. **Verify File Exists:**

   - Check file path is correct
   - Verify component is exported (default or named export)

3. **Rebuild:**
   ```bash
   npm run build
   ```

### Fix Environment Variables

1. **Local Development (.env):**

   ```env
   # Frontend (.env)
   VITE_AUTH_SERVER_URL=http://localhost:3001

   # Backend (google-login-demo/.env)
   NODE_ENV=development
   BASE_URL=http://localhost:3001
   FRONTEND_URL=http://localhost:5173
   DATABASE_URL=postgresql://localhost:5432/brokerforce_dev
   ```

2. **Production:**
   - Set in Netlify Dashboard → Site settings → Environment variables
   - Set in Railway Dashboard → Variables tab
   - Redeploy after changes

---

## Environment Variables Reference

### Frontend (Netlify)

| Variable               | Description     | Example                                                      |
| ---------------------- | --------------- | ------------------------------------------------------------ |
| `VITE_AUTH_SERVER_URL` | Backend API URL | `https://brokerforce-website-production-a631.up.railway.app` |

### Backend (Railway)

| Variable               | Description           | Required | Example                                |
| ---------------------- | --------------------- | -------- | -------------------------------------- |
| `NODE_ENV`             | Environment           | Yes      | `production`                           |
| `BASE_URL`             | Backend URL           | Yes      | `https://[railway-url].up.railway.app` |
| `FRONTEND_URL`         | Frontend URL          | Yes      | `https://brokerforce.ai`               |
| `PORT`                 | Server port           | No       | `3001` (default)                       |
| `DATABASE_URL`         | PostgreSQL connection | Yes      | `postgresql://...`                     |
| `GOOGLE_CLIENT_ID`     | Google OAuth ID       | Yes      | From Google Console                    |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret   | Yes      | From Google Console                    |
| `SESSION_SECRET`       | Session encryption    | Yes      | Random 32+ char string                 |
| `JWT_SECRET`           | JWT signing key       | Yes      | Random 32+ char string                 |
| `JWT_EXPIRES_IN`       | JWT expiration        | No       | `7d` (default)                         |

### Local Development

Create `.env` files:

**Root `.env`:**

```env
VITE_AUTH_SERVER_URL=http://localhost:3001
```

**google-login-demo/.env:**

```env
NODE_ENV=development
BASE_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://localhost:5432/brokerforce_dev
GOOGLE_CLIENT_ID=your_dev_client_id
GOOGLE_CLIENT_SECRET=your_dev_client_secret
SESSION_SECRET=dev_secret_change_in_production
JWT_SECRET=dev_jwt_secret_change_in_production
JWT_EXPIRES_IN=7d
PORT=3001
```

---

## Architecture Overview

### System Architecture

```
┌─────────────────┐
│   Frontend      │
│   (Netlify)     │
│ brokerforce.ai  │
└────────┬────────┘
         │ HTTPS
         │ API Calls
         ▼
┌─────────────────┐
│    Backend      │
│   (Railway)     │
│  Express.js     │
└────────┬────────┘
         │
         │ SQL Queries
         ▼
┌─────────────────┐
│   Database      │
│   (Supabase)    │
│  PostgreSQL     │
└─────────────────┘
```

### Frontend Architecture

- **Framework**: React 18 with TypeScript
- **Routing**: React Router DOM
- **State Management**: React Query (server state) + Context API (auth state)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Build Tool**: Vite
- **Package Manager**: npm (for builds)

### Backend Architecture

- **Framework**: Express.js
- **Database**: PostgreSQL (via `pg` client)
- **Authentication**: Passport.js (Google OAuth) + JWT + Sessions
- **Session Store**: Express-session (in-memory, can upgrade to Redis)
- **API**: RESTful endpoints

### Data Flow

1. **User Authentication:**

   - User clicks "Sign in" → Redirects to `/auth/google`
   - Backend handles OAuth flow with Google
   - Creates/updates user in database
   - Creates session cookie
   - Redirects to frontend with session

2. **API Requests:**

   - Frontend makes requests to `VITE_AUTH_SERVER_URL/api/*`
   - Includes credentials (cookies) for authentication
   - Backend validates session/JWT
   - Returns data from database

3. **Property Data:**
   - Frontend fetches from SimplyRETS API directly
   - Cached with React Query
   - User favorites stored in PostgreSQL

---

## Development Workflow

### Making Changes

1. **Frontend Changes:**

   ```bash
   # Make changes in src/
   # Vite auto-reloads in development
   npm run dev
   ```

2. **Backend Changes:**

   ```bash
   # Make changes in google-login-demo/
   # Nodemon auto-restarts server
   cd google-login-demo
   npm run dev
   ```

3. **Database Changes:**
   - Update schema in `google-login-demo/db/schema.sql`
   - Or create migration file
   - Server auto-initializes on startup

### Testing Locally

1. **Start Both Servers:**

   ```bash
   ./start-servers.sh
   ```

2. **Test Authentication:**

   - Go to http://localhost:5173
   - Click "Sign in"
   - Complete Google OAuth flow
   - Verify user created in database

3. **Test API Endpoints:**

   ```bash
   # Health check
   curl http://localhost:3001/health

   # Check auth (requires session cookie)
   curl http://localhost:3001/api/me --cookie "connect.sid=..."
   ```

---

## Security Best Practices

1. **Environment Variables:**

   - Never commit `.env` files
   - Use strong, random secrets
   - Rotate secrets periodically

2. **Database:**

   - Use connection pooling (Supabase)
   - Parameterized queries (already implemented)
   - Regular backups

3. **Authentication:**

   - HTTPS only in production
   - Secure cookie settings
   - JWT expiration

4. **API:**
   - Rate limiting (consider adding)
   - Input validation
   - Error handling (don't expose internals)

---

## Support & Resources

### Documentation Files

- `README.md` - Project overview and features
- `DEPLOYMENT_GUIDE.md` - Detailed deployment instructions
- `SETUP.md` - Development environment setup
- `GOOGLE_LOGIN_SETUP.md` - OAuth configuration
- `SUPABASE_SETUP.md` - Database setup guide
- `POSTGRESQL_SETUP.md` - Local PostgreSQL setup
- `DEVELOPMENT.md` - Development guidelines
- `TROUBLESHOOTING.md` - Common issues and solutions

### External Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Railway Documentation](https://docs.railway.app)
- [Google OAuth Guide](https://developers.google.com/identity/protocols/oauth2)

---

## Quick Reference Commands

```bash
# Setup
./setup.sh                    # Initial setup
./start-servers.sh            # Start dev servers

# Frontend
npm run dev                   # Start frontend dev server
npm run build                 # Build for production
npm run lint                  # Lint code

# Backend
cd google-login-demo
npm run dev                   # Start backend with nodemon
npm start                     # Start production server

# Database
psql "[DATABASE_URL]"         # Connect to database
npm run migrate               # Run migrations (if needed)

# Git
git status                    # Check changes
git add .                     # Stage changes
git commit -m "message"       # Commit
git push origin main          # Push to main branch
```

---

**Last Updated**: December 2024

This guide consolidates information from all previous documentation files. For specific details, refer to the individual documentation files mentioned above.
