# Debug: OAuth Callback Error

## The Problem:

You can select a Google account, but after clicking "Continue", you get:
```json
{"error":"Internal server error","message":"Something went wrong"}
```

This means:
- ✅ Google OAuth is working (you can select account)
- ✅ Callback is reaching your backend
- ❌ Something is failing when backend processes the callback (likely database)

## Solution: Check Railway Logs

The error message will tell us exactly what's wrong.

### Step 1: Check Railway Deployment Logs

1. Go to Railway → Your service → **Deployments** tab
2. Click on the **latest deployment**
3. Click **"View Logs"**
4. Scroll to the **bottom** (most recent logs)
5. Look for error messages, especially around the time you tried to sign in

**What errors do you see in the logs?**

Look for:
- Database connection errors
- "Failed to initialize database schema"
- "Cannot connect to PostgreSQL"
- Any error messages in red

### Step 2: Verify Database Connection

Check if the database connection is working:

1. In Railway logs, look for:
   - ✅ `✅ Connected to PostgreSQL database`
   - ✅ `✅ Database schema initialized successfully!`
   - ❌ Any database errors

**Do you see database connection success messages or errors?**

---

## Is Supabase Connected?

Yes, you should have `DATABASE_URL` set in Railway! Let's verify:

### Step 3: Verify DATABASE_URL is Set

1. Railway → Your service → **Variables** tab
2. Look for `DATABASE_URL`
3. **Is it set?** (Should have your Supabase connection string)
4. **What does it start with?** (Should be `postgresql://...`)

**Is DATABASE_URL set in Railway?**

---

## Common Issues:

### Issue 1: DATABASE_URL Not Set or Wrong
- Missing or incorrect connection string
- **Fix:** Verify it's set correctly

### Issue 2: Database Schema Not Initialized
- Tables don't exist yet
- **Fix:** Check if schema initialized (should happen automatically on startup)

### Issue 3: Database Connection Failed
- Can't connect to Supabase
- **Fix:** Check connection string, verify Supabase is accessible

---

## What I Need From You:

1. **What errors do you see in Railway logs?** (Copy the error messages)
2. **Do you see database connection success messages?** (Like "✅ Connected to PostgreSQL database")
3. **Is DATABASE_URL set in Railway variables?** (Check Variables tab)

This will help me figure out exactly what's wrong!
