# How to Get Your Railway Backend URL

## Step-by-Step Instructions

### Step 1: Go to Railway Dashboard

1. Go to [https://railway.app/](https://railway.app/)
2. Sign in if needed
3. You should see your project(s)

### Step 2: Open Your Project

1. Click on your project (the one connected to your repo)
2. You should see your service(s) listed

### Step 3: Open Your Service

1. Click on your service (probably named after your repo or "BrokerForce-Website")
2. You'll see tabs: **Deployments**, **Metrics**, **Settings**, etc.

### Step 4: Go to Settings

1. Click on the **"Settings"** tab (usually at the top or in a sidebar)
2. Scroll down to find the **"Networking"** section

### Step 5: Get or Generate Domain

#### Option A: If You Already Have a Domain

- Look for **"Public Domain"** or **"Custom Domain"**
- You'll see a URL like: `https://your-project-name.up.railway.app`
- ✅ **Copy this URL** - this is your Railway backend URL!

#### Option B: If You Need to Generate a Domain

1. In the **"Networking"** section, you'll see:
   - **"Generate Domain"** button, or
   - **"Public Domain"** section with a generate option

2. Click **"Generate Domain"** or **"Generate"**

3. Railway will create a URL like:
   - `https://your-project-production.up.railway.app`
   - Or similar format

4. ✅ **Copy this URL** - this is your Railway backend URL!

### Step 6: Save Your URL

**Write down or copy this URL somewhere safe!** You'll need it for:
- `BASE_URL` environment variable in Railway
- `VITE_AUTH_SERVER_URL` in Netlify
- Google OAuth configuration

---

## What the URL Looks Like

Your Railway URL will be in this format:
```
https://[project-name]-[random].up.railway.app
```

Examples:
- `https://brokerforce-production.up.railway.app`
- `https://brokerforce-website-production.up.railway.app`
- `https://unique-repreive-production.up.railway.app`

---

## Quick Checklist

- [ ] Logged into Railway
- [ ] Opened your project
- [ ] Opened your service
- [ ] Went to Settings tab
- [ ] Found Networking section
- [ ] Generated or copied the domain/URL
- [ ] Saved the URL

---

## If You Can't Find It

### Alternative Location: Service Overview

Sometimes the URL is shown at the top of the service page:
- Look for a link/button that says your domain
- Or click on the service name and look for URL/domain info

### Still Can't Find It?

1. Make sure your service is **deployed** (check Deployments tab)
2. Some services need to be deployed before you can generate a domain
3. Check if there are any errors preventing domain generation

---

## Next Steps After Getting URL

Once you have your Railway URL:

1. ✅ Add it to Railway environment variable: `BASE_URL`
2. ✅ Add it to Netlify environment variable: `VITE_AUTH_SERVER_URL`
3. ✅ Add it to Google OAuth authorized origins and redirect URIs
4. ✅ Test the `/health` endpoint: `https://your-url.railway.app/health`

---

**Let me know what URL you get and we'll continue with the setup!**
