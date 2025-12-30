# Fix: OAuth Client Not Found Error

## The Problem:

You're getting "OAuth client was not found" error. This means:
- ✅ Frontend is connecting to Railway correctly (good!)
- ✅ Backend is receiving the request (good!)
- ❌ Google OAuth credentials are wrong/missing in Railway

## Common Causes:

1. **GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set in Railway**
2. **Credentials in Railway don't match Google Cloud Console**
3. **OAuth client was deleted or doesn't exist in Google Cloud Console**
4. **Typos in the credentials**

---

## Solution: Verify and Fix Google OAuth Credentials

### Step 1: Check Railway Environment Variables

1. Go to Railway → Your service → **Variables** tab
2. Look for:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
3. **Questions:**
   - Do they exist?
   - What are their values? (Don't share them, just verify they're set)
   - Any obvious typos?

**Are both variables set in Railway?**

### Step 2: Verify Credentials in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Look for your **OAuth 2.0 Client ID**
5. Click on it to view details

**Does the OAuth client exist? What does it show?**

### Step 3: Compare Values

Compare the values:

1. **In Railway** → `GOOGLE_CLIENT_ID` should match:
   - **In Google Cloud Console** → Your OAuth Client ID

2. **In Railway** → `GOOGLE_CLIENT_SECRET` should match:
   - **In Google Cloud Console** → Your OAuth Client Secret

⚠️ **If you can't see the Client Secret in Google Console:**
- You can't view it again after creation
- You'll need to create new credentials or reset the secret

### Step 4: Update Railway Variables (If Needed)

If the values don't match:

1. Copy the correct **Client ID** from Google Cloud Console
2. Copy the correct **Client Secret** from Google Cloud Console (if visible)
3. Update in Railway:
   - Edit `GOOGLE_CLIENT_ID` → Paste correct Client ID
   - Edit `GOOGLE_CLIENT_SECRET` → Paste correct Client Secret
4. Railway will automatically redeploy

### Step 5: If Client Secret is Missing

If you can't see the Client Secret in Google Cloud Console:

**Option A: Reset the Secret**
1. In Google Cloud Console → Your OAuth Client
2. Click **"Reset Secret"** or similar
3. Copy the new secret
4. Update `GOOGLE_CLIENT_SECRET` in Railway

**Option B: Create New OAuth Client**
1. Create a new OAuth 2.0 Client ID
2. Copy the new Client ID and Client Secret
3. Update both in Railway
4. Update authorized redirect URIs in Google Console

---

## Quick Checklist:

- [ ] `GOOGLE_CLIENT_ID` exists in Railway
- [ ] `GOOGLE_CLIENT_SECRET` exists in Railway
- [ ] OAuth client exists in Google Cloud Console
- [ ] Client ID in Railway matches Google Cloud Console
- [ ] Client Secret in Railway matches Google Cloud Console (if visible)
- [ ] Railway redeployed after updating credentials

---

## What to Check Right Now:

1. **Are `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` both set in Railway?**
2. **Does the OAuth client exist in Google Cloud Console?**
3. **Can you see the Client Secret in Google Cloud Console?** (or do you need to reset it?)

Let me know what you find and we'll fix it!
