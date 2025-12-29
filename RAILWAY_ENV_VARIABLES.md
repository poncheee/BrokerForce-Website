# Railway Environment Variables Setup

Add these variables one by one in Railway's "Shared Variables" section.

## Step-by-Step: Add Each Variable

For each variable below, click "New Variable" and enter:
- **VARIABLE_NAME**: (the name on the left)
- **VALUE**: (the value on the right)

---

## 1. Database Connection (REQUIRED - Add This First!)

**VARIABLE_NAME:** `DATABASE_URL`

**VALUE:**
```
postgresql://postgres:IH2DpPzMRKKVIEIK@db.qvdadefcgomysuckvevj.supabase.co:5432/postgres?pgbouncer=true
```

---

## 2. Server Configuration

**VARIABLE_NAME:** `NODE_ENV`

**VALUE:**
```
production
```

**VARIABLE_NAME:** `PORT`

**VALUE:**
```
3001
```

*(Note: Railway may set PORT automatically, but it's good to set it explicitly)*

---

## 3. Session Secret (REQUIRED)

**VARIABLE_NAME:** `SESSION_SECRET`

**VALUE:**
```
c2dd23a1c8e3b778cf49bd196a08b6540516a77447798612ec98b9be428f1690
```

---

## 4. JWT Configuration (REQUIRED)

**VARIABLE_NAME:** `JWT_SECRET`

**VALUE:**
```
679f602075d044eb2727a277e77d5d048c4e5b855c5cf39cf8224c24321f8f6f
```

**VARIABLE_NAME:** `JWT_EXPIRES_IN`

**VALUE:**
```
7d
```

---

## 5. Google OAuth (REQUIRED - You Need to Get These)

**VARIABLE_NAME:** `GOOGLE_CLIENT_ID`

**VALUE:**
*(Get this from Google Cloud Console - see instructions below)*

**VARIABLE_NAME:** `GOOGLE_CLIENT_SECRET`

**VALUE:**
*(Get this from Google Cloud Console - see instructions below)*

**How to Get Google OAuth Credentials:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one)
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Copy the **Client ID** → use for `GOOGLE_CLIENT_ID`
7. Copy the **Client Secret** → use for `GOOGLE_CLIENT_SECRET`

⚠️ **Important:** You'll need to update the authorized redirect URIs in Google Console after Railway deployment (we'll do this in Step 4).

---

## 6. URLs (Update After Deployment)

**VARIABLE_NAME:** `BASE_URL`

**VALUE:**
```
https://your-app-name.railway.app
```

⚠️ **Note:** Replace `your-app-name.railway.app` with your actual Railway URL after deployment. Railway will give you a URL like `https://brokerforce-production.up.railway.app` - use that exact URL.

**VARIABLE_NAME:** `FRONTEND_URL`

**VALUE:**
```
https://rebrokerforceai.netlify.app
```

*(Or your actual Netlify frontend URL if different)*

---

## Quick Checklist

Add these variables in Railway (in order of importance):

- [ ] `DATABASE_URL` - ✅ Ready (use the connection string above)
- [ ] `NODE_ENV` - ✅ Ready (set to `production`)
- [ ] `PORT` - ✅ Ready (set to `3001`)
- [ ] `SESSION_SECRET` - ✅ Ready (use the generated secret above)
- [ ] `JWT_SECRET` - ✅ Ready (use the generated secret above)
- [ ] `JWT_EXPIRES_IN` - ✅ Ready (set to `7d`)
- [ ] `GOOGLE_CLIENT_ID` - ⚠️ Need to get from Google Cloud Console
- [ ] `GOOGLE_CLIENT_SECRET` - ⚠️ Need to get from Google Cloud Console
- [ ] `BASE_URL` - ⚠️ Update after Railway deployment (use your Railway URL)
- [ ] `FRONTEND_URL` - ✅ Ready (set to `https://rebrokerforceai.netlify.app`)

---

## After Adding Variables

1. Railway will automatically redeploy when you add variables
2. Check the deployment logs to see if the database connects
3. Look for: `✅ Connected to PostgreSQL database`
4. Look for: `✅ Database schema initialized successfully!`

---

## Troubleshooting

**If deployment fails:**
- Check that `DATABASE_URL` is correct (copy exactly from above)
- Verify all required variables are set
- Check Railway logs for specific error messages

**If database connection fails:**
- Verify `DATABASE_URL` format is correct
- Check that Supabase allows connections from Railway (should work by default)
- Make sure you're using the connection pooling URI (with `?pgbouncer=true`)
