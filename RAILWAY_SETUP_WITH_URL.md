# Railway Setup with Your URL

## Your Railway Backend URL:
```
https://brokerforce-website-production-a631.up.railway.app
```

---

## Step 1: Add Environment Variables to Railway

Go to Railway → Your service → **Variables** tab → Add these one by one:

### 1. DATABASE_URL
**VARIABLE_NAME:** `DATABASE_URL`
**VALUE:**
```
postgresql://postgres:IH2DpPzMRKKVIEIK@db.qvdadefcgomysuckvevj.supabase.co:5432/postgres?pgbouncer=true
```

### 2. NODE_ENV
**VARIABLE_NAME:** `NODE_ENV`
**VALUE:**
```
production
```

### 3. PORT
**VARIABLE_NAME:** `PORT`
**VALUE:**
```
3001
```

### 4. SESSION_SECRET
**VARIABLE_NAME:** `SESSION_SECRET`
**VALUE:**
```
c2dd23a1c8e3b778cf49bd196a08b6540516a77447798612ec98b9be428f1690
```

### 5. JWT_SECRET
**VARIABLE_NAME:** `JWT_SECRET`
**VALUE:**
```
679f602075d044eb2727a277e77d5d048c4e5b855c5cf39cf8224c24321f8f6f
```

### 6. JWT_EXPIRES_IN
**VARIABLE_NAME:** `JWT_EXPIRES_IN`
**VALUE:**
```
7d
```

### 7. BASE_URL
**VARIABLE_NAME:** `BASE_URL`
**VALUE:**
```
https://brokerforce-website-production-a631.up.railway.app
```
⚠️ **Important:** Use this exact URL with `https://`

### 8. FRONTEND_URL
**VARIABLE_NAME:** `FRONTEND_URL`
**VALUE:**
```
https://brokerforce.netlify.app
```

### 9. GOOGLE_CLIENT_ID
**VARIABLE_NAME:** `GOOGLE_CLIENT_ID`
**VALUE:**
*(You'll get this from Google Cloud Console - see Step 2)*

### 10. GOOGLE_CLIENT_SECRET
**VARIABLE_NAME:** `GOOGLE_CLIENT_SECRET`
**VALUE:**
*(You'll get this from Google Cloud Console - see Step 2)*

---

## Step 2: Set Up Google OAuth

### 2.1 Go to Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select a project
3. Go to **APIs & Services** → **Credentials**

### 2.2 Create or Edit OAuth Credentials

If you already have OAuth credentials:
1. Click on your OAuth 2.0 Client ID
2. Under **Authorized JavaScript origins**, add:
   - `https://brokerforce.netlify.app`
   - `https://brokerforce-website-production-a631.up.railway.app`
3. Under **Authorized redirect URIs**, add:
   - `https://brokerforce-website-production-a631.up.railway.app/auth/google/callback`
4. Click **Save**

If you need to create new credentials:
1. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
2. Choose **"Web application"**
3. Name: `BrokerForce Auth Server`
4. **Authorized JavaScript origins** (add both):
   - `https://brokerforce.netlify.app`
   - `https://brokerforce-website-production-a631.up.railway.app`
5. **Authorized redirect URIs** (add this):
   - `https://brokerforce-website-production-a631.up.railway.app/auth/google/callback`
6. Click **Create**
7. Copy the **Client ID** and **Client Secret**
8. Add them to Railway (variables #9 and #10 above)

---

## Step 3: Update Netlify

### 3.1 Set Environment Variable

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Select your site
3. **Site settings** → **Environment variables**
4. Add/Edit:
   - **Key:** `VITE_AUTH_SERVER_URL`
   - **Value:** `https://brokerforce-website-production-a631.up.railway.app`
   - **Context:** Production
5. Save

### 3.2 Redeploy Netlify

1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait for deployment to complete

---

## Step 4: Verify Root Directory in Railway

Make sure Railway is deploying the backend:

1. Railway → Your service → **Settings** tab
2. Check **Root Directory** field
3. Should be: `google-login-demo`
4. If not, set it to `google-login-demo` and save

---

## Step 5: Test Everything

### 5.1 Test Backend Health

Visit:
```
https://brokerforce-website-production-a631.up.railway.app/health
```

**Expected:** JSON response like:
```json
{"status":"OK","timestamp":"...","environment":"production"}
```

### 5.2 Check Database Connection

1. Railway → Your service → **Deployments** → Latest → **View Logs**
2. Look for:
   - ✅ `✅ Connected to PostgreSQL database`
   - ✅ `✅ Database schema initialized successfully!`

### 5.3 Test Google Sign-In

1. Visit your Netlify site
2. Click "Sign in"
3. Should redirect to: `https://brokerforce-website-production-a631.up.railway.app/auth/google`
4. After signing in with Google, should redirect back to your site
5. Should show your name/avatar in the header

---

## Quick Checklist

- [ ] Added all 10 environment variables to Railway
- [ ] Set `BASE_URL` to your Railway URL
- [ ] Google OAuth credentials created/updated with your Railway URL
- [ ] `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` added to Railway
- [ ] `VITE_AUTH_SERVER_URL` set in Netlify to your Railway URL
- [ ] Netlify redeployed
- [ ] Root Directory set to `google-login-demo` in Railway
- [ ] Tested `/health` endpoint
- [ ] Verified database connection in logs
- [ ] Tested Google Sign-In

---

## Important URLs Summary

**Railway Backend:**
- `https://brokerforce-website-production-a631.up.railway.app`

**Netlify Frontend:**
- `https://brokerforce.netlify.app`

**Google OAuth Callback:**
- `https://brokerforce-website-production-a631.up.railway.app/auth/google/callback`

---

**Start by adding the environment variables to Railway, then we'll test!**
