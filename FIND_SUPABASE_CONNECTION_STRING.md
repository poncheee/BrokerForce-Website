# How to Find Supabase Connection Pooling URL

## Alternative Ways to Find It:

### Method 1: Settings → Database → Connection String

1. Go to Supabase Dashboard
2. Select your project
3. Click **Settings** (gear icon in left sidebar)
4. Click **Database** (in the Settings menu)
5. Scroll down to find **"Connection string"** section
6. Look for tabs or options for:
   - Connection pooling
   - Session mode
   - Transaction mode
   - Pooler

### Method 2: Project Settings → Database

1. Go to your project dashboard
2. Look for **Settings** or **Project Settings**
3. Go to **Database** section
4. Look for connection strings

### Method 3: SQL Editor or API Settings

Sometimes the connection strings are in:
- **Settings** → **API** (might have database connection info)
- Or look around in the Database settings

### Method 4: Look for "Connection Info" or "Connection Details"

In Settings → Database, look for:
- Connection info
- Connection details
- Connection string
- Connection pooling
- Database URL

---

## What to Look For:

When you find the connection string section, you should see options for:
- **Direct connection** (don't use this)
- **Connection pooling** (use this)
- Or tabs like: **URI**, **Connection pooling**, etc.

---

## Alternative: Check if Connection Pooling is Available

Connection pooling might not be available on all Supabase projects. If you can't find it:

1. **Check your Supabase plan** - Connection pooling might require a paid plan
2. **Try the direct connection with IPv4** - We might need to configure it differently
3. **Contact Supabase support** - They can help enable connection pooling

---

## What I Need:

1. **What do you see in Settings → Database?** (List the options/sections you see)
2. **Is there a "Connection string" section?** What does it show?
3. **Are you on the free tier or paid plan?**

This will help me guide you to the right place!
