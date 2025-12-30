# Google OAuth URLs Configuration

## For Your New OAuth Credentials

### Authorized JavaScript Origins

Add these two URLs (add them one at a time):

1. `https://brokerforce.netlify.app`
   - Your Netlify frontend URL

2. `https://brokerforce-website-production-a631.up.railway.app`
   - Your Railway backend URL

### Authorized Redirect URIs

Add this ONE URL:

1. `https://brokerforce-website-production-a631.up.railway.app/auth/google/callback`
   - Your Railway backend callback URL (where Google redirects after authentication)

---

## Step-by-Step in Google Cloud Console

1. **Application type:** Select **"Web application"**

2. **Name:** `BrokerForce Auth Server` (or any name you like)

3. **Authorized JavaScript origins:**
   - Click **"+ ADD URI"**
   - Enter: `https://brokerforce.netlify.app`
   - Click **"+ ADD URI"** again
   - Enter: `https://brokerforce-website-production-a631.up.railway.app`

4. **Authorized redirect URIs:**
   - Click **"+ ADD URI"**
   - Enter: `https://brokerforce-website-production-a631.up.railway.app/auth/google/callback`

5. Click **"CREATE"**

6. **Copy both values:**
   - Client ID
   - Client Secret (copy immediately - you won't see it again!)

---

## Important Notes:

- ✅ All URLs must start with `https://`
- ✅ No trailing slashes at the end
- ✅ Use exact URLs (copy-paste to avoid typos)
- ✅ The redirect URI must match exactly what your backend expects

---

## After Creating:

1. Add `GOOGLE_CLIENT_ID` to Railway with your new Client ID
2. Add `GOOGLE_CLIENT_SECRET` to Railway with your new Client Secret
3. Railway will redeploy automatically
4. Test the sign-in flow

---

**Copy these exact values into Google Cloud Console!**
