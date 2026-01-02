# PostgreSQL Setup Guide - Development & Production

> **Note**: For new setups, use `./setup.sh` which automatically handles PostgreSQL setup. This guide is for manual setup or troubleshooting.

This guide will help you set up PostgreSQL for both local development and production deployment.

## Recommended Approach

- **Local Development**: PostgreSQL running on your machine (auto-configured by `./setup.sh`)
- **Production**: Cloud PostgreSQL (Railway/Heroku Postgres/Supabase)

---

## Part 1: Local Development Setup (macOS)

### Step 1: Install PostgreSQL

**Option A: Using Homebrew (Recommended)**

```bash
# Install PostgreSQL
brew install postgresql@14

# Start PostgreSQL service
brew services start postgresql@14

# Verify it's running
brew services list | grep postgresql
```

**Option B: Using Postgres.app (Easier GUI option)**

1. Download from: https://postgresapp.com/
2. Install and open the app
3. Click "Initialize" to create a new server
4. Click "Start" button
5. The server will run on port 5432

### Step 2: Create Local Database

```bash
# Connect to PostgreSQL (default user is your macOS username)
psql postgres

# Create database
CREATE DATABASE brokerforce_dev;

# Verify it was created
\l

# Exit psql
\q
```

Or using command line:

```bash
createdb brokerforce_dev
```

### Step 3: Update Local Environment File

Edit `google-login-demo/.env`:

```env
# Database Configuration - LOCAL DEVELOPMENT
DATABASE_URL=postgresql://localhost:5432/brokerforce_dev

# For Postgres.app users, you might need:
# DATABASE_URL=postgresql://localhost:5432/brokerforce_dev

# If you created a specific user:
# DATABASE_URL=postgresql://username:password@localhost:5432/brokerforce_dev
```

### Step 4: Initialize Database Schema

```bash
cd google-login-demo
node db/init.js
```

You should see: `✅ Database schema created successfully!`

### Step 5: Verify Setup

```bash
# Connect to your database
psql brokerforce_dev

# List tables
\dt

# You should see:
# users
# user_favorites
# purchase_requests
# offers
# documents
# payments

# Exit
\q
```

---

## Part 2: Production Setup

### Option A: Railway (Recommended - Easiest)

**Step 1: Add PostgreSQL Service**

1. Go to your Railway project dashboard
2. Click "New" → "Database" → "Add PostgreSQL"
3. Railway will automatically create a PostgreSQL database
4. Click on the PostgreSQL service to see details

**Step 2: Get Connection URL**

1. In the PostgreSQL service, go to "Variables" tab
2. Copy the `DATABASE_URL` value (Railway automatically creates this)

**Step 3: Set Environment Variables**

1. Go to your backend service (not the database service)
2. Navigate to "Variables" tab
3. Add/verify these variables:

```env
DATABASE_URL=<copied-from-postgres-service>
JWT_SECRET=fe8825b23fca90316eb91cd0e4fc4c034043738094da3eaf1324d2b05619a5df
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
FRONTEND_URL=https://brokerforce.ai
BASE_URL=https://your-railway-app.railway.app
NODE_ENV=production
```

**Step 4: Initialize Production Database Schema**

You have two options:

**Option 1: Using Railway CLI (Recommended)**

```bash
# Install Railway CLI
brew install railway

# Login to Railway
railway login

# Link to your project
railway link

# Connect to production database and run schema
railway connect postgres < google-login-demo/db/schema.sql
```

**Option 2: Using Railway Database Dashboard**

1. Go to your PostgreSQL service in Railway
2. Click "Data" tab
3. Use the SQL editor to paste and run the contents of `google-login-demo/db/schema.sql`

---

### Option B: Heroku Postgres

**Step 1: Add PostgreSQL Addon**

```bash
cd google-login-demo

# Add Heroku Postgres (free hobby-dev tier)
heroku addons:create heroku-postgresql:hobby-dev

# This automatically creates DATABASE_URL environment variable
```

**Step 2: Verify DATABASE_URL is Set**

```bash
heroku config:get DATABASE_URL
```

**Step 3: Set Other Environment Variables**

```bash
heroku config:set JWT_SECRET=fe8825b23fca90316eb91cd0e4fc4c034043738094da3eaf1324d2b05619a5df
heroku config:set JWT_EXPIRES_IN=7d
# ... other variables
```

**Step 4: Initialize Production Database Schema**

```bash
# Using Heroku CLI
heroku pg:psql < google-login-demo/db/schema.sql

# OR connect interactively
heroku pg:psql
# Then paste and run the schema.sql contents
```

---

### Option C: Supabase (Free Tier Available)

**Step 1: Create Project**

1. Go to https://supabase.com/
2. Create a new project
3. Wait for database to be provisioned

**Step 2: Get Connection String**

1. Go to Project Settings → Database
2. Copy the "Connection string" (URI format)
3. It will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

**Step 3: Set Environment Variables**

In your hosting platform (Railway/Heroku/Render), set:

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

**Step 4: Initialize Schema**

Use Supabase SQL Editor or connect via psql:

```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres" < google-login-demo/db/schema.sql
```

---

## Part 3: Environment Configuration Strategy

### Development vs Production Database URLs

The app automatically uses the `DATABASE_URL` environment variable. You'll have different values:

**Local Development** (`google-login-demo/.env`):

```env
DATABASE_URL=postgresql://localhost:5432/brokerforce_dev
NODE_ENV=development
```

**Production** (Railway/Heroku/Render environment variables):

```env
DATABASE_URL=postgresql://user:password@host:5432/database
NODE_ENV=production
```

The code automatically uses the correct one based on where it's running.

---

## Part 4: Quick Setup Script

### Local Setup (One-time)

```bash
# 1. Start PostgreSQL (if using Homebrew)
brew services start postgresql@14

# 2. Create database
createdb brokerforce_dev

# 3. Initialize schema
cd google-login-demo
node db/init.js

# 4. Verify
psql brokerforce_dev -c "\dt"
```

### Verify Everything Works

```bash
# Start your servers
./start-servers.sh

# Try logging in - you should see in console:
# ✅ Connected to PostgreSQL database
# New user created: [Your Name] ([your-email])
```

---

## Troubleshooting

### "Connection Refused" Error

**Problem**: PostgreSQL not running locally

**Solution**:

```bash
# Check if PostgreSQL is running
pg_isready

# If not running, start it:
brew services start postgresql@14
# OR launch Postgres.app
```

### "Database Does Not Exist"

**Problem**: Database wasn't created

**Solution**:

```bash
createdb brokerforce_dev
```

### "Relation Does Not Exist"

**Problem**: Schema not initialized

**Solution**:

```bash
cd google-login-demo
node db/init.js
```

### Production Connection Issues

**Problem**: Can't connect to production database

**Solutions**:

1. Verify `DATABASE_URL` is set correctly in hosting platform
2. Check database firewall allows connections from your hosting platform
3. Verify database credentials are correct
4. For Railway: Check that database service is running

---

## Recommended Workflow

### Daily Development

1. Start PostgreSQL (if not auto-starting):

   ```bash
   brew services start postgresql@14
   ```

2. Start development servers:

   ```bash
   ./start-servers.sh
   ```

3. Your `.env` file already points to local database

### Production Deployment

1. Database is already set up in your hosting platform
2. Environment variables are already configured
3. Schema is already initialized
4. Just deploy your code - database connection happens automatically

---

## Security Notes

- ✅ Never commit `.env` files to git
- ✅ Use different database credentials for dev and production
- ✅ Keep production database credentials secure
- ✅ Regularly backup production database
- ✅ Use connection pooling in production (already handled by pg Pool)

---

## Quick Reference

### Local Commands

```bash
# Start PostgreSQL
brew services start postgresql@14

# Stop PostgreSQL
brew services stop postgresql@14

# Connect to database
psql brokerforce_dev

# List databases
psql -l

# List tables in database
psql brokerforce_dev -c "\dt"

# Drop and recreate (WARNING: deletes all data)
dropdb brokerforce_dev
createdb brokerforce_dev
node db/init.js
```

### Production Commands (Railway)

```bash
# Connect to production database
railway connect postgres

# Run SQL file
railway connect postgres < db/schema.sql
```

### Production Commands (Heroku)

```bash
# Connect to production database
heroku pg:psql

# Run SQL file
heroku pg:psql < db/schema.sql

# Backup database
heroku pg:backups:capture
```
