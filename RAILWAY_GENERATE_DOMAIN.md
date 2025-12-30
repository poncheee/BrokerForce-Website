# How to Generate Railway Domain

## Step 1: Generate a Public Domain

1. In your "unique-repreive" service
2. Go to **Settings** tab
3. Scroll to **"Networking"** section
4. You should see **"Generate Domain"** button
5. Click **"Generate Domain"**
6. Railway will create a public URL like: `https://unique-repreive-production.up.railway.app`

## Step 2: Copy Your Domain

After generating:

1. The domain will appear in the Networking section
2. It will look like: `https://unique-repreive-production.up.railway.app` (or similar)
3. **Copy this entire URL** (including `https://`)
4. ✅ Save it - you'll need it for the `BASE_URL` environment variable!

## Step 3: Use This URL

Once you have the domain:

- This is your **backend URL**
- You'll use it for the `BASE_URL` environment variable
- You'll also need to add it to Google OAuth settings later
- Your frontend will use this URL to connect to the backend

## Note

- If "Generate Domain" is grayed out or not clickable, your service might not be deployed yet
- Make sure your service is deployed first (check Deployments tab)
- Railway only generates domains for active deployments
