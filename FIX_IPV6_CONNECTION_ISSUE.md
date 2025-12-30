# Fix IPv6 Connection Issue - Use Session Pooler URL

## The Problem:

Railway is trying to connect via IPv6 (`2600:1f13:838:6e00:e331:620d:3e27:9731`) and can't reach Supabase. This suggests the connection string is resolving to IPv6.

## Solution: Use Session Pooler URL

Instead of the regular connection pooling URL, we need to use Supabase's **Session Pooler** URL which uses a different endpoint (port 6543).

### Step 1: Get Session Pooler URL from Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project (`qvdadefcgomysuckvevj`)
3. Go to **Settings** (gear icon) → **Database**
4. Scroll to **"Connection string"** section
5. Click on the **"Connection pooling"** tab
6. Look for **"Session mode"** (not Transaction mode)
7. Copy the **URI** connection string

It should look like one of these formats:
```
postgresql://postgres.xxxxx:PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

Or:
```
postgresql://postgres:[YOUR-PASSWORD]@aws-0-REGION.pooler.supabase.com:6543/postgres
```

⚠️ **Important:**
- Uses port **6543** (not 5432)
- Uses `pooler.supabase.com` domain (not `db.xxxxx.supabase.co`)
- Still includes your password

### Step 2: Update DATABASE_URL in Railway

1. Go to Railway → Your service → **Variables** tab
2. Edit `DATABASE_URL`
3. Paste the Session Pooler URL from Step 1
4. **Replace `[YOUR-PASSWORD]` with your actual password:** `IH2DpPzMRKKVIEIK`
5. Save

### Step 3: Wait for Redeployment

Railway will automatically redeploy. Wait for it to complete.

### Step 4: Test

After redeployment, try signing in again. The connection should work!

---

## Alternative: If Session Pooler Doesn't Work

If the Session Pooler URL still doesn't work, try the **Transaction Pooler** URL:

1. In Supabase → Settings → Database → Connection pooling
2. Try **"Transaction mode"** instead of "Session mode"
3. Copy that URI
4. Update DATABASE_URL in Railway

---

## Quick Checklist:

- [ ] Got Session Pooler URL from Supabase (port 6543)
- [ ] Replaced password placeholder with actual password
- [ ] Updated DATABASE_URL in Railway
- [ ] Waited for Railway redeployment
- [ ] Tested sign-in again

---

**Try getting the Session Pooler URL from Supabase and updating Railway. This should fix the IPv6 connection issue!**
