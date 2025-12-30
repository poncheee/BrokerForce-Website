# Fix Database Connection Error: ENETUNREACH

## The Problem:

You're seeing:
```
Error: connect ENETUNREACH 2600:1f13:838:6e00:e331:620d:3e27:9731:5432
```

This means Railway can't connect to Supabase. The IPv6 address suggests a network connectivity issue.

## Possible Causes:

1. **DATABASE_URL format is wrong**
2. **Supabase network restrictions**
3. **IPv6 connectivity issue**
4. **Wrong connection string type** (using direct connection instead of pooling)

## Solution: Verify DATABASE_URL

### Step 1: Check DATABASE_URL in Railway

1. Go to Railway → Your service → **Variables** tab
2. Find `DATABASE_URL`
3. **What is the exact value?** (Copy it, but you can mask the password part)

**The connection string should be:**
```
postgresql://postgres:IH2DpPzMRKKVIEIK@db.qvdadefcgomysuckvevj.supabase.co:5432/postgres?pgbouncer=true
```

**Important checks:**
- ✅ Should start with `postgresql://`
- ✅ Should have `?pgbouncer=true` at the end
- ✅ Should use port `5432` (not 6543 or other)
- ✅ Should use the domain name, not IP address

### Step 2: Verify Connection String Format

Make sure it's exactly:
```
postgresql://postgres:PASSWORD@db.qvdadefcgomysuckvevj.supabase.co:5432/postgres?pgbouncer=true
```

Replace `PASSWORD` with your actual password: `IH2DpPzMRKKVIEIK`

### Step 3: Try Connection Pooling URL

If you're using the direct connection, switch to connection pooling:

**Connection Pooling URL** (recommended):
```
postgresql://postgres.xxxxx:IH2DpPzMRKKVIEIK@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

Or the URI format:
```
postgresql://postgres:IH2DpPzMRKKVIEIK@db.qvdadefcgomysuckvevj.supabase.co:5432/postgres?pgbouncer=true
```

### Step 4: Check Supabase Network Settings

1. Go to Supabase Dashboard
2. Your project → **Settings** → **Database**
3. Check **"Network Restrictions"** or **"Connection Pooling"**
4. Make sure **"Allow all IPs"** is enabled (or Railway IPs are allowed)

---

## Quick Fix: Update DATABASE_URL

The correct connection string should be:

```
postgresql://postgres:IH2DpPzMRKKVIEIK@db.qvdadefcgomysuckvevj.supabase.co:5432/postgres?pgbouncer=true
```

**Steps:**
1. Go to Railway → Variables
2. Edit `DATABASE_URL`
3. Make sure it's exactly the string above (with your password)
4. Save
5. Railway will redeploy

---

## What to Check:

1. **What is the exact DATABASE_URL value in Railway?** (You can mask the password)
2. **Does it have `?pgbouncer=true` at the end?**
3. **Does it use the domain name** (`db.qvdadefcgomysuckvevj.supabase.co`) **or an IP address?**

Share what you find and I'll help you fix it!
