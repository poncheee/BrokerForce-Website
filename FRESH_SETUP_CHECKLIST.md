# Fresh Setup Checklist - Your Own Repo

## Current Situation:
- ✅ You forked the repo (now you own it)
- ✅ Railway project connected to YOUR repo
- ✅ Netlify frontend (still connected)
- ✅ Supabase database (already set up)
- 🎯 Goal: Google Sign-In working + Supabase connected

---

## Step 1: Verify Railway Backend Setup

### 1.1 Check Railway Service Configuration

1. Go to Railway dashboard
2. Open your project
3. Check your service:
   - **Root Directory** should be: `google-login-demo`
   - If not set, set it to `google-login-demo`

### 1.2 Get Your Railway Backend URL

1. In Railway → Your service → **Settings** → **Networking**
2. If you don't have a domain yet, click **"Generate Domain"**
3. **Copy the URL** - it will look like: `https://your-project-name.up.railway.app`
4. ✅ **Save this URL** - you'll need it for everything!

---

## Step 2: Add Environment Variables to Railway

Go to Railway → Your service → **Variables** tab → Add these:

### Required Variables:

1. **DATABASE_URL**
   - Value: `postgresql://postgres:IH2DpPzMRKKVIEIK@db.qvdadefcgomysuckvevj.supabase.co:5432/postgres?pgbouncer=true`
   - ✅ You already have this from Supabase setup

2. **NODE_ENV**
   - Value: `production`

3. **PORT**
   - Value: `3001`

4. **SESSION_SECRET**
   - Value: `c2dd23a1c8e3b778cf49bd196a08b6540516a77447798612ec98b9be428f1690`
   - ✅ Already generated

5. **JWT_SECRET**
   - Value: `679f602075d044eb2727a277e77d5d048c4e5b855c5cf39cf8224c24321f8f6f`
   - ✅ Already generated

6. **JWT_EXPIRES_IN**
   - Value: `7d`

7. **BASE_URL**
   - Value: `https://your-railway-url.up.railway.app`
   - ⚠️ **Replace with your actual Railway URL from Step 1.2!**

8. **FRONTEND_URL**
   - Value: `https://rebrokerforceai.netlify.app`
   - ⚠️ **Or your actual Netlify URL if different**

9. **GOOGLE_CLIENT_ID**
   - Value: (Get from Google Cloud Console - see Step 3)

10. **GOOGLE_CLIENT_SECRET**
    - Value: (Get from Google Cloud Console - see Step 3)

---

## Step 3: Set Up Google OAuth (If Not Done Yet)

### 3.1 Create/Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select a project
3. Go to **APIs & Services** → **Credentials**
4. Create **OAuth 2.0 Client ID** (or use existing)
5. Configure:
   - **Authorized JavaScript origins:**
     - `https://rebrokerforceai.netlify.app` (your Netlify URL)
     - `https://your-railway-url.up.railway.app` (your Railway URL)
   - **Authorized redirect URIs:**
     - `https://your-railway-url.up.railway.app/auth/google/callback`
6. Copy **Client ID** and **Client Secret**
7. Add them to Railway variables (Step 2, #9 and #10)

---

## Step 4: Update Netlify Frontend

### 4.1 Set Environment Variable in Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Select your site
3. **Site settings** → **Environment variables**
4. Add/Edit:
   - **Key:** `VITE_AUTH_SERVER_URL`
   - **Value:** `https://your-railway-url.up.railway.app`
   - ⚠️ **Use your actual Railway URL from Step 1.2!**
   - **Context:** Production
5. Save

### 4.2 Redeploy Netlify

1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait for deployment to complete

---

## Step 5: Verify Everything Works

### 5.1 Test Backend

Visit: `https://your-railway-url.up.railway.app/health`

**Expected:** JSON response like `{"status":"OK",...}`

### 5.2 Check Database Connection

1. Railway → Your service → **Deployments** → Latest → **View Logs**
2. Look for:
   - ✅ `✅ Connected to PostgreSQL database`
   - ✅ `✅ Database schema initialized successfully!`

### 5.3 Test Google Sign-In

1. Visit your Netlify site
2. Click "Sign in"
3. Should redirect to: `https://your-railway-url.up.railway.app/auth/google`
4. After Google sign-in, should redirect back to your site
5. Should show your name/avatar in header

---

## Quick Checklist

- [ ] Railway Root Directory set to `google-login-demo`
- [ ] Railway domain generated (got the URL)
- [ ] All 10 environment variables added to Railway
- [ ] Google OAuth credentials created/updated with new URLs
- [ ] `VITE_AUTH_SERVER_URL` set in Netlify
- [ ] Netlify redeployed
- [ ] Backend `/health` endpoint works
- [ ] Database connection successful (check logs)
- [ ] Google Sign-In works end-to-end

---

## Important URLs to Update

When setting up Google OAuth, use these exact URLs (replace with your actual Railway URL):

**Authorized JavaScript origins:**
- `https://rebrokerforceai.netlify.app`
- `https://your-railway-url.up.railway.app`

**Authorized redirect URI:**
- `https://your-railway-url.up.railway.app/auth/google/callback`

---

## Troubleshooting

### Backend not working:
- Check Root Directory is `google-login-demo`
- Verify all environment variables are set
- Check deployment logs for errors

### Frontend still using localhost:
- Verify `VITE_AUTH_SERVER_URL` is set in Netlify
- Make sure you redeployed Netlify after setting variable
- Clear browser cache

### Database connection fails:
- Verify `DATABASE_URL` is correct
- Check Railway logs for specific error

### Google Sign-In doesn't work:
- Verify redirect URI in Google Console matches exactly
- Check `BASE_URL` in Railway matches your Railway URL
- No trailing slashes in URLs

---

**Start with Step 1 - get your Railway URL and we'll go from there!**
