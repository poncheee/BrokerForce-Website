# Local Development Guide

Quick start guide for running BrokerForce locally.

## Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org/))
- **pnpm 8.10.0+** (will be auto-installed by setup script if missing)

## Setup

Run the setup script to install all dependencies and create environment files:

```bash
./setup.sh
```

This will:

- ✅ Check/install Node.js and pnpm
- ✅ Install frontend dependencies (pnpm)
- ✅ Install backend dependencies (npm)
- ✅ Create `.env.local` from `env.example` (if missing)
- ✅ Create `google-login-demo/.env` from `env.example` (if missing)

## Environment Variables

### Frontend (`.env.local`)

Optional - only needed if using SimplyRETS API:

```env
VITE_SIMPLYRETS_API_URL=https://api.simplyrets.com
VITE_SIMPLYRETS_API_KEY=your_api_key_here
VITE_SIMPLYRETS_SECRET=your_secret_here
```

### Backend (`google-login-demo/.env`)

Optional - only needed if using Google OAuth:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
SESSION_SECRET=your-super-secret-session-key-change-this
PORT=3001
NODE_ENV=development
BASE_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173
```

## Run Development Servers

Start both frontend and backend servers:

```bash
./start-servers.sh
```

This will start:

- 📱 **Frontend**: http://localhost:5173 (React/Vite)
- 🔐 **Backend**: http://localhost:3001 (Auth server)

Press `Ctrl+C` to stop both servers.

## Manual Start (Alternative)

If you prefer to run servers separately:

**Terminal 1 - Backend:**

```bash
cd google-login-demo
npm run dev
```

**Terminal 2 - Frontend:**

```bash
pnpm dev
```

## Troubleshooting

- **Ports already in use**: Stop processes on ports 3001 and 5173
- **Missing dependencies**: Run `./setup.sh` again
- **Environment variables**: Check that `.env.local` and `google-login-demo/.env` exist
- **pnpm not found**: Run `npm install -g pnpm@8.10.0`
