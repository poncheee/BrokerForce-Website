# Fix Frontend Using Localhost Instead of Railway

## The Problem:

When you click "Sign in" on your Netlify site, it redirects to:
- ❌ `http://localhost:3001/auth/google` (wrong - localhost)

Instead of:
- ✅ `https://brokerforce-website-production-a631.up.railway.app/auth/google` (correct - Railway)

## Why This Happens:

Your frontend code uses this environment variable:
```typescript
const baseUrl = import.meta.env.VITE_AUTH_SERVER_URL || "http://localhost:3001";
```

If `VITE_AUTH_SERVER_URL` isn't set in Netlify, it falls back to `localhost:3001`.

**Vite reads environment variables at BUILD TIME**, so you must:
1. Set the variable in Netlify
2. Redeploy Netlify (so it rebuilds with the variable)

---

## Solution: Set Environment Variable in Netlify

### Step 1: Go to Netlify Dashboard

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Sign in if needed
3. Find and click on your site (`brokerforce`)

### Step 2: Add Environment Variable

1. Click **"Site settings"** (gear icon in the top menu)
2. Scroll down to **"Environment variables"** section
3. Click **"Add a variable"** button

### Step 3: Set the Variable

Enter:
- **Key:** `VITE_AUTH_SERVER_URL`
- **Value:** `https://brokerforce-website-production-a631.up.railway.app`
- **Scopes:** Select **"Production"** (or "All scopes")
- **"Contains secret values"** → Leave unchecked (it's a public URL)

⚠️ **Important:**
- No trailing slash at the end!
- Must include `https://`
- Use your exact Railway URL

### Step 4: Save

Click **"Save"** or **"Add variable"**

### Step 5: Redeploy Netlify (CRITICAL!)

**This is the most important step!** Netlify must rebuild for the variable to be available.

1. Go to **"Deploys"** tab (in the top menu)
2. Click **"Trigger deploy"** button (usually a dropdown)
3. Select **"Deploy site"**
4. Wait for deployment to complete (usually 1-2 minutes)
5. You'll see a new deployment appear in the list

### Step 6: Test

After redeployment completes:

1. Visit your Netlify site: `https://brokerforce.netlify.app`
2. Open browser developer tools (F12)
3. Go to **Console** tab (optional - to verify)
4. Click "Sign in" button
5. Should now redirect to: `https://brokerforce-website-production-a631.up.railway.app/auth/google`
6. NOT `http://localhost:3001/auth/google`

---

## Optional: Verify Variable is Set

You can check if the variable is available in the browser console:

1. Visit your Netlify site
2. Open browser console (F12)
3. Type: `console.log(import.meta.env.VITE_AUTH_SERVER_URL)`
4. Should show: `https://brokerforce-website-production-a631.up.railway.app`
5. If it shows `undefined` or `http://localhost:3001`, the variable isn't set correctly

---

## Why You Must Redeploy

**Vite builds your React app at BUILD TIME**, not runtime. So:

- ❌ Just setting the variable → Old build still running (still uses localhost)
- ✅ Setting variable + Redeploy → New build includes the variable (uses Railway URL)

The environment variable gets "baked into" the JavaScript code during the build process.

---

## Troubleshooting

### Still redirecting to localhost after redeploy:

1. ✅ Double-check variable name: `VITE_AUTH_SERVER_URL` (must start with `VITE_`)
2. ✅ Verify value is correct (no typos, includes `https://`)
3. ✅ Make sure you selected "Production" scope
4. ✅ Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
5. ✅ Check Netlify build logs to see if variable was available during build

### Variable not showing in console:

- Make sure you redeployed after setting the variable
- Check Netlify build logs for any errors
- Verify the variable is set in the correct context (Production)

---

## Quick Checklist:

- [ ] Added `VITE_AUTH_SERVER_URL` to Netlify environment variables
- [ ] Set value to `https://brokerforce-website-production-a631.up.railway.app`
- [ ] Selected "Production" scope
- [ ] Saved the variable
- [ ] Triggered a new deployment in Netlify
- [ ] Waited for deployment to complete
- [ ] Tested sign-in (should go to Railway, not localhost)

---

**After you complete these steps, the sign-in should redirect to Railway!**
