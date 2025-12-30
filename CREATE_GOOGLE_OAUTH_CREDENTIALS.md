# Create Google OAuth Credentials - Step by Step

## Overview
You need to create Google OAuth credentials so users can sign in with Google on your website.

**Time needed:** ~5-10 minutes

---

## Step 1: Go to Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. If this is your first time, accept the terms of service

---

## Step 2: Create or Select a Project

### If you don't have a project:
1. Click the project dropdown at the top (next to "Google Cloud")
2. Click **"New Project"**
3. Enter project name: `BrokerForce` (or any name you like)
4. Click **"Create"**
5. Wait a few seconds for it to be created
6. Select the new project from the dropdown

### If you already have a project:
1. Click the project dropdown at the top
2. Select your project

---

## Step 3: Enable Google+ API (if needed)

1. In the left sidebar, click **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"** or **"Google Identity"**
3. If you see it, click on it and click **"Enable"**
4. (Note: Google+ API might be deprecated, but Google Sign-In should work without it)

**Actually, you can skip this step** - Google Sign-In works without enabling specific APIs in most cases.

---

## Step 4: Configure OAuth Consent Screen

1. In the left sidebar, click **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"** (unless you have a Google Workspace account)
3. Click **"Create"**

### Fill in the OAuth Consent Screen:

1. **App name:** `BrokerForce` (or your app name)
2. **User support email:** Your email address
3. **Developer contact information:** Your email address
4. Click **"Save and Continue"**

### Scopes (Step 2):
1. Click **"Add or Remove Scopes"**
2. Select these scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
3. Click **"Update"**
4. Click **"Save and Continue"**

### Test users (Step 3):
- You can skip this for now
- Click **"Save and Continue"**

### Summary (Step 4):
- Review and click **"Back to Dashboard"**

---

## Step 5: Create OAuth 2.0 Credentials

1. In the left sidebar, click **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth client ID"**

### Configure OAuth Client:

1. **Application type:** Select **"Web application"**

2. **Name:** `BrokerForce Auth Server` (or any name)

3. **Authorized JavaScript origins:**
   Click **"+ ADD URI"** and add these (one at a time):
   - `https://rebrokerforceai.netlify.app`
   - `https://brokerforce-website-production.up.railway.app`

4. **Authorized redirect URIs:**
   Click **"+ ADD URI"** and add:
   - `https://brokerforce-website-production.up.railway.app/auth/google/callback`

5. Click **"CREATE"**

---

## Step 6: Copy Your Credentials

After clicking "CREATE", a popup will appear with:

1. **Your Client ID** - Copy this (looks like: `123456789-abcdefg.apps.googleusercontent.com`)
2. **Your Client Secret** - Copy this (looks like: `GOCSPX-abcdefghijklmnop`)

⚠️ **Important:** Copy both of these NOW - you won't be able to see the Client Secret again!

---

## Step 7: Add to Railway

1. Go back to Railway dashboard
2. Click on your **"BrokerForce-Website"** service
3. Go to **"Variables"** tab
4. Click **"New Variable"**

### Add GOOGLE_CLIENT_ID:
- **VARIABLE_NAME:** `GOOGLE_CLIENT_ID`
- **VALUE:** Paste your Client ID (the long one ending in `.apps.googleusercontent.com`)

### Add GOOGLE_CLIENT_SECRET:
- **VARIABLE_NAME:** `GOOGLE_CLIENT_SECRET`
- **VALUE:** Paste your Client Secret (starts with `GOCSPX-`)

---

## Step 8: Wait for Redeployment

1. Railway will automatically redeploy after you add the variables
2. Go to **"Deployments"** tab
3. Wait for deployment to complete (should show "Active")
4. Check logs - should see: `🚀 BrokerForce Auth Server running on...`

---

## Step 9: Test

1. Visit: `https://brokerforce-website-production.up.railway.app/health`
2. Should see JSON: `{"status":"OK",...}`
3. Visit: `https://brokerforce-website-production.up.railway.app/`
4. Should see the backend demo page (not your React homepage)

---

## Troubleshooting

### "Redirect URI mismatch" error:
- Make sure the redirect URI in Google Console exactly matches:
  - `https://brokerforce-website-production.up.railway.app/auth/google/callback`
- No trailing slash, exact URL

### Still getting errors:
- Double-check you copied the Client ID and Secret correctly
- Make sure there are no extra spaces
- Verify the variables are saved in Railway

---

## Quick Checklist

- [ ] Created/selected Google Cloud project
- [ ] Configured OAuth consent screen
- [ ] Created OAuth 2.0 Client ID
- [ ] Added authorized JavaScript origins (2 URLs)
- [ ] Added authorized redirect URI (1 URL)
- [ ] Copied Client ID and Client Secret
- [ ] Added `GOOGLE_CLIENT_ID` to Railway
- [ ] Added `GOOGLE_CLIENT_SECRET` to Railway
- [ ] Waited for Railway redeployment
- [ ] Tested `/health` endpoint

---

**Let me know when you've completed these steps and we'll test it!**
