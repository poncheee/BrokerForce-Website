# Add Missing Google OAuth Environment Variables

## The Problem:
Your backend crashed because it's missing:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

## Solution: Add These to Railway

### Step 1: Go to Railway Variables

1. In Railway, click on your **"BrokerForce-Website"** service
2. Go to **"Variables"** tab
3. Click **"New Variable"** (or "+" button)

### Step 2: Add GOOGLE_CLIENT_ID

1. **VARIABLE_NAME:** `GOOGLE_CLIENT_ID`
2. **VALUE:** (You need to get this from Google Cloud Console - see below)

### Step 3: Add GOOGLE_CLIENT_SECRET

1. **VARIABLE_NAME:** `GOOGLE_CLIENT_SECRET`
2. **VALUE:** (You need to get this from Google Cloud Console - see below)

---

## How to Get Google OAuth Credentials

### Option A: If You Already Have Google OAuth Set Up

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Find your **OAuth 2.0 Client ID**
5. Click on it
6. Copy:
   - **Client ID** → Use for `GOOGLE_CLIENT_ID`
   - **Client Secret** → Use for `GOOGLE_CLIENT_SECRET`

### Option B: If You Need to Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **Google+ API** (or it might be enabled automatically)
4. Go to **APIs & Services** → **Credentials**
5. Click **Create Credentials** → **OAuth 2.0 Client ID**
6. Choose **Web application**
7. Fill in:
   - **Name:** BrokerForce Auth Server (or any name)
   - **Authorized JavaScript origins:**
     - `https://rebrokerforceai.netlify.app` (your frontend)
     - `https://brokerforce-website-production.up.railway.app` (your backend)
   - **Authorized redirect URIs:**
     - `https://brokerforce-website-production.up.railway.app/auth/google/callback`
8. Click **Create**
9. Copy:
   - **Client ID** → Use for `GOOGLE_CLIENT_ID`
   - **Client Secret** → Use for `GOOGLE_CLIENT_SECRET`

---

## After Adding Variables

1. Railway will automatically redeploy
2. Wait for deployment to complete
3. Check the logs - should see: `🚀 BrokerForce Auth Server running on...`
4. Test `/health` endpoint again

---

## Quick Question:

**Do you already have Google OAuth credentials set up?**
- ✅ Yes → Just copy them from Google Cloud Console
- ❌ No → I'll help you create them

Let me know and I can guide you through the specific steps!
