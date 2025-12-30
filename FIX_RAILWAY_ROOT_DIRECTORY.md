# Fix Railway Root Directory - Step by Step

## The Problem:
- Your backend code is in the `google-login-demo` folder
- Railway has no Root Directory set, so it's deploying from the root (frontend code)
- That's why `/health` returns 404

## The Solution:
Set the Root Directory to `google-login-demo` so Railway deploys the backend.

---

## Step-by-Step Instructions:

### Step 1: Go to Your Service Settings

1. In Railway dashboard, click on your **"BrokerForce-Website"** service
2. Click on the **"Settings"** tab (gear icon or tab at the top)

### Step 2: Find Root Directory Setting

Look for **"Root Directory"** or **"Service Root"** in the settings. It might be in:
- **"Service"** section
- **"General"** section
- Or a separate section

### Step 3: Set Root Directory

1. Click on the Root Directory field (or "Edit" if it's not editable)
2. Enter: `google-login-demo`
3. Click **"Save"** or **"Update"**

### Step 4: Wait for Redeployment

- Railway will automatically redeploy after you save
- Go to **"Deployments"** tab to watch it redeploy
- Wait for the deployment to finish (should show "Active")

### Step 5: Test Again

Once deployment is complete, test the `/health` endpoint again:
```
https://brokerforce-website-production.up.railway.app/health
```

You should now see:
```json
{"status":"OK","timestamp":"...","environment":"production"}
```

---

## If You Can't Find Root Directory Setting:

Sometimes Railway's UI is different. Try:

1. **Service Settings** → Look for "Configure" or "Settings"
2. **Service** tab → Look for "Root Directory" or "Source Root"
3. If you see **"Source"** → Click it → Look for Root Directory option

---

## Alternative: Check Deployment Logs First

Before changing anything, let's see what's currently deployed:

1. Go to **"Deployments"** tab
2. Click on the latest deployment
3. Click **"View Logs"**
4. Look for:
   - Does it mention `server.js`? (good - means backend)
   - Does it mention `vite` or `react`? (bad - means frontend)
   - Any error messages?

---

## After Setting Root Directory:

Once Root Directory is set to `google-login-demo`:
- ✅ Railway will deploy the backend code
- ✅ Your environment variables will be used
- ✅ `/health` endpoint will work
- ✅ Database connection will be established
