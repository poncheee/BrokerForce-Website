# Reset Google OAuth Client Secret

## Step-by-Step: Reset Client Secret

### Step 1: Go to Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in
3. Select your project (the one with your OAuth credentials)

### Step 2: Find Your OAuth Client

1. Go to **APIs & Services** → **Credentials**
2. Find your **OAuth 2.0 Client ID** in the list
3. Click on it to open the details

### Step 3: Reset the Client Secret

1. In the OAuth client details page, look for:
   - **"Reset Secret"** button, or
   - **"Secret"** section with a reset option
2. Click **"Reset Secret"** or **"Reset"**
3. A new secret will be generated
4. ⚠️ **Copy the new secret immediately!** (You won't be able to see it again)

### Step 4: Copy Both Values

You should now see:
1. **Client ID** - Copy this (shouldn't change)
2. **Client Secret** - Copy the NEW secret

⚠️ **Save both values somewhere safe!**

### Step 5: Update Railway Environment Variables

1. Go to Railway → Your service → **Variables** tab
2. Find `GOOGLE_CLIENT_ID`
   - Edit it → Paste your Client ID
   - Save
3. Find `GOOGLE_CLIENT_SECRET`
   - Edit it → Paste the NEW Client Secret (the one you just reset)
   - Save

### Step 6: Wait for Railway to Redeploy

- Railway will automatically redeploy after you update the variables
- Go to **Deployments** tab
- Wait for the new deployment to complete

### Step 7: Verify Authorized Redirect URI (Important!)

While you're in Google Cloud Console, make sure your redirect URI is correct:

1. In the OAuth client details, scroll to **Authorized redirect URIs**
2. Make sure this is listed:
   - `https://brokerforce-website-production-a631.up.railway.app/auth/google/callback`
3. If it's not there, add it and click **Save**

### Step 8: Test

After Railway redeploys:

1. Visit your Netlify site: `https://brokerforce.netlify.app`
2. Click "Sign in"
3. Should redirect to Google OAuth
4. After signing in, should redirect back to your site

---

## Quick Checklist:

- [ ] Reset Client Secret in Google Cloud Console
- [ ] Copied new Client ID and Client Secret
- [ ] Updated `GOOGLE_CLIENT_ID` in Railway (if needed)
- [ ] Updated `GOOGLE_CLIENT_SECRET` in Railway with NEW secret
- [ ] Verified authorized redirect URI is correct
- [ ] Waited for Railway to redeploy
- [ ] Tested sign-in

---

## Important Notes:

- The **Client ID** usually doesn't change when you reset the secret
- The **Client Secret** is what gets reset and generates a new value
- You must update `GOOGLE_CLIENT_SECRET` in Railway with the NEW secret
- The old secret will stop working after you reset it

---

**After you reset the secret and update Railway, let me know and we'll test it!**
