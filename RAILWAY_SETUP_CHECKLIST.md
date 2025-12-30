# Railway Backend Setup Checklist

Since you already have a Railway project, let's make sure your backend is properly configured.

## Step 1: Verify Your Railway Service

1. Go to [Railway Dashboard](https://railway.app/)
2. Open your project
3. Check what service(s) you have:
   - Do you see a service for the backend (auth server)?
   - Or do you only have a frontend service?

### If you DON'T have a backend service yet:

You need to add one:

1. In your Railway project, click **"+ New"** → **"GitHub Repo"**
2. Select your `BrokerForce-Website` repository
3. Railway might auto-detect, but you need to set:
   - **Root Directory**: `google-login-demo`
   - This tells Railway to deploy the backend folder, not the frontend

### If you DO have a backend service:

Great! Let's verify it's configured correctly:

1. Click on your backend service
2. Go to **Settings** tab
3. Check **Root Directory** - it should be: `google-login-demo`
4. If it's not, change it to `google-login-demo` and save

---

## Step 2: Get Your Railway Backend URL

1. In your Railway project, click on your **backend service**
2. Go to **Settings** tab
3. Scroll to **"Networking"** section
4. Find **"Public Domain"** or **"Custom Domain"**
5. **Copy the URL** - it will look like: `https://your-app-name.up.railway.app`
6. ✅ Save this URL - you'll need it for environment variables!

---

## Step 3: Add Environment Variables

Go to your backend service → **Variables** tab → **Shared Variables**

Add these variables one by one (click "New Variable" for each):

### ✅ Required Variables:

1. **DATABASE_URL**
   - **VALUE**: `postgresql://postgres:IH2DpPzMRKKVIEIK@db.qvdadefcgomysuckvevj.supabase.co:5432/postgres?pgbouncer=true`

2. **NODE_ENV**
   - **VALUE**: `production`

3. **PORT**
   - **VALUE**: `3001`

4. **SESSION_SECRET**
   - **VALUE**: `c2dd23a1c8e3b778cf49bd196a08b6540516a77447798612ec98b9be428f1690`

5. **JWT_SECRET**
   - **VALUE**: `679f602075d044eb2727a277e77d5d048c4e5b855c5cf39cf8224c24321f8f6f`

6. **JWT_EXPIRES_IN**
   - **VALUE**: `7d`

7. **BASE_URL**
   - **VALUE**: `https://your-railway-backend-url.up.railway.app`
   - ⚠️ **Replace with your actual Railway backend URL from Step 2!**

8. **FRONTEND_URL**
   - **VALUE**: `https://rebrokerforceai.netlify.app`
   - ⚠️ **Or your actual Netlify frontend URL if different**

### ⚠️ Still Need (Get from Google Cloud Console):

9. **GOOGLE_CLIENT_ID**
   - Get from: [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials

10. **GOOGLE_CLIENT_SECRET**
    - Get from: Same place as above

---

## Step 4: Verify Deployment

After adding variables, Railway will automatically redeploy:

1. Go to **Deployments** tab
2. Wait for deployment to complete (should show "Active")
3. Click on the latest deployment → **View Logs**
4. Look for these success messages:
   - `✅ Connected to PostgreSQL database`
   - `✅ Database schema initialized successfully!`
   - `🚀 BrokerForce Auth Server running on 0.0.0.0:PORT`

---

## Step 5: Test Your Backend

1. Get your Railway backend URL (from Step 2)
2. Visit: `https://your-backend-url.railway.app/health`
3. You should see JSON response like: `{"status":"ok"}`
4. If you see 404 or error, check the deployment logs

---

## Troubleshooting

### Backend URL returns 404:
- Check Root Directory is set to `google-login-demo`
- Check deployment logs for errors
- Verify all environment variables are set

### Database connection fails:
- Verify `DATABASE_URL` is correct (copy exactly)
- Check Railway logs for specific error
- Make sure Supabase allows connections (should work by default)

### Service won't start:
- Check all required environment variables are set
- Look at deployment logs for specific error messages
- Verify `NODE_ENV=production` is set

---

## Next Steps After Backend is Working:

1. ✅ Update Google OAuth settings (add Railway callback URL)
2. ✅ Update Netlify environment variable (`VITE_AUTH_SERVER_URL`)
3. ✅ Test Google Sign-In on your live site
