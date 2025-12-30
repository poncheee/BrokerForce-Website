# Fix Netlify Environment Variable - Frontend Using Localhost

## The Problem:
Frontend is redirecting to `http://localhost:3001` instead of your Railway backend because the environment variable isn't set or the site wasn't redeployed.

## Solution: Set Environment Variable in Netlify

### Step 1: Go to Netlify Dashboard

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Sign in if needed
3. Find and click on your site (probably `rebrokerforceai` or similar)

### Step 2: Add Environment Variable

1. Click on **"Site settings"** (gear icon in the top menu)
2. Scroll down to **"Environment variables"** section
3. Click **"Add a variable"** button

### Step 3: Set the Variable

Enter:
- **Key:** `VITE_AUTH_SERVER_URL`
- **Value:** `https://brokerforce-website-production.up.railway.app`
- **Scopes:** Select **"Production"** (or "All scopes" if you want it everywhere)
- **Context:** Production

⚠️ **Important:**
- No trailing slash at the end!
- Use `https://` not `http://`
- Use your exact Railway URL

### Step 4: Save

Click **"Save"** or **"Add variable"**

### Step 5: Redeploy Site (CRITICAL!)

**This is the most important step!** Netlify needs to rebuild the site for the environment variable to be available.

1. Go to **"Deploys"** tab (in the top menu)
2. Click **"Trigger deploy"** button
3. Select **"Deploy site"**
4. Wait for deployment to complete (usually 1-2 minutes)

### Step 6: Verify

After redeployment:

1. Visit your Netlify site
2. Open browser developer tools (F12)
3. Go to **Console** tab
4. You can check what URL is being used by typing in console:
   ```javascript
   console.log(import.meta.env.VITE_AUTH_SERVER_URL)
   ```
5. Should show: `https://brokerforce-website-production.up.railway.app`
6. If it shows `undefined` or `http://localhost:3001`, the variable isn't set correctly

### Step 7: Test Sign-In

1. Click "Sign in" button on your site
2. Should redirect to: `https://brokerforce-website-production.up.railway.app/auth/google`
3. NOT `http://localhost:3001/auth/google`

---

## Why This Happens:

Vite (your build tool) reads environment variables **at build time**, not runtime. So:
- ✅ Setting the variable in Netlify dashboard
- ✅ Redeploying the site
- ✅ Variable is now available in the built code

If you don't redeploy, the old build (without the variable) is still being served.

---

## Troubleshooting

### Still redirecting to localhost after redeploy:
1. ✅ Double-check the variable name: `VITE_AUTH_SERVER_URL` (must start with `VITE_`)
2. ✅ Verify the value is correct (no typos, includes `https://`)
3. ✅ Make sure you selected "Production" scope
4. ✅ Clear browser cache and try again
5. ✅ Check Netlify build logs to see if variable was available during build

### Variable not showing in console:
- Make sure you redeployed after setting the variable
- Check Netlify build logs for any errors
- Verify the variable is set in the correct context (Production)

---

## Quick Checklist:

- [ ] Added `VITE_AUTH_SERVER_URL` to Netlify environment variables
- [ ] Set value to `https://brokerforce-website-production.up.railway.app`
- [ ] Selected "Production" scope
- [ ] Saved the variable
- [ ] Triggered a new deployment
- [ ] Waited for deployment to complete
- [ ] Tested sign-in (should go to Railway, not localhost)

---

**After you complete these steps, the sign-in should work!**
