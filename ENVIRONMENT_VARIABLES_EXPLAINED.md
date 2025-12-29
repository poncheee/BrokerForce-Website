# Environment Variables Explained

A detailed explanation of each environment variable you're adding to Railway.

---

## 1. DATABASE_URL

**What it is:**
The connection string that tells your backend server how to connect to your Supabase PostgreSQL database.

**Why you need it:**
- Your backend needs to know where your database is located
- It includes the database server address, username, password, and database name
- Without this, your app can't save user data, favorites, offers, etc.

**What it contains:**
- `postgres://` - Protocol (PostgreSQL)
- `postgres` - Database username
- `IH2DpPzMRKKVIEIK` - Your database password
- `db.qvdadefcgomysuckvevj.supabase.co` - Supabase server address
- `5432` - Database port
- `postgres` - Database name
- `?pgbouncer=true` - Uses connection pooling (better for cloud deployments)

**Example:**
```
postgresql://postgres:password@server:5432/database?pgbouncer=true
```

---

## 2. NODE_ENV

**What it is:**
Tells Node.js what environment your app is running in (development or production).

**Why you need it:**
- Production mode enables optimizations and security features
- Some code behaves differently in production (error handling, logging, etc.)
- Your database connection uses SSL in production mode

**Values:**
- `production` - For live/deployed apps (what you're using)
- `development` - For local testing

---

## 3. PORT

**What it is:**
The port number your backend server listens on for incoming requests.

**Why you need it:**
- Your server needs to know which port to use
- Railway can set this automatically, but it's good to be explicit
- Port 3001 is what your backend is configured to use

**Note:**
Railway might override this with their own port, but setting it ensures consistency.

---

## 4. SESSION_SECRET

**What it is:**
A secret key used to encrypt and sign user sessions (cookies).

**Why you need it:**
- When users log in, the server creates a session cookie
- This secret encrypts that cookie so it can't be tampered with
- Without it, sessions would be insecure and anyone could fake being logged in

**Security:**
- Must be random and secret (never share it!)
- The one I generated is 64 characters of random hex
- Different from JWT_SECRET (they serve different purposes)

**What happens if it's wrong:**
- Users can't stay logged in
- Sessions get invalidated on every request
- Security vulnerability

---

## 5. JWT_SECRET

**What it is:**
A secret key used to sign JSON Web Tokens (JWTs).

**Why you need it:**
- JWTs are tokens that prove a user is authenticated
- This secret signs the token so it can't be forged
- Used for API authentication between frontend and backend

**Security:**
- Must be random and secret (never share it!)
- Different from SESSION_SECRET
- The one I generated is 64 characters of random hex

**What happens if it's wrong:**
- Authentication tokens won't work
- Users can't access protected API endpoints
- Frontend can't verify user identity

---

## 6. JWT_EXPIRES_IN

**What it is:**
How long JWT tokens remain valid before expiring.

**Why you need it:**
- Security: Tokens shouldn't last forever
- After this time, users need to log in again
- Balances security with user convenience

**Value:**
- `7d` = 7 days
- Other options: `1h` (1 hour), `24h` (24 hours), `30d` (30 days)

**What happens if it's wrong:**
- Too short: Users get logged out too often
- Too long: Security risk if token is stolen

---

## 7. FRONTEND_URL

**What it is:**
The URL where your frontend (React app) is hosted.

**Why you need it:**
- Backend needs to know which frontend is allowed to make requests
- Used for CORS (Cross-Origin Resource Sharing) security
- Prevents other websites from using your API

**Value:**
- `https://rebrokerforceai.netlify.app` - Your Netlify frontend URL

**What happens if it's wrong:**
- Frontend can't make API calls to backend
- CORS errors in browser
- Login and API requests will fail

---

## 8. BASE_URL

**What it is:**
The public URL where your backend server is accessible.

**Why you need it:**
- Used in redirects (like after Google OAuth login)
- Needed for generating callback URLs
- Tells Google where to send users after authentication

**Value:**
- Will be something like: `https://brokerforce-production.up.railway.app`
- Railway gives you this URL after deployment
- You'll update this variable after Railway deployment

**What happens if it's wrong:**
- OAuth redirects won't work
- Google can't redirect users back to your app
- Login flow breaks

---

## 9. GOOGLE_CLIENT_ID

**What it is:**
Your Google OAuth application's Client ID (public identifier).

**Why you need it:**
- Identifies your app to Google's OAuth service
- Required for "Sign in with Google" to work
- You get this from Google Cloud Console

**Where to get it:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → Credentials
3. Find your OAuth 2.0 Client ID
4. Copy the "Client ID" value

**What happens if it's wrong:**
- Google Sign-In button won't work
- Users can't authenticate with Google
- OAuth flow fails

---

## 10. GOOGLE_CLIENT_SECRET

**What it is:**
Your Google OAuth application's Client Secret (private key).

**Why you need it:**
- Proves to Google that requests are coming from your app
- Must be kept secret (never expose it publicly!)
- Used server-side only (never in frontend code)

**Where to get it:**
1. Same place as GOOGLE_CLIENT_ID
2. In Google Cloud Console → Credentials
3. Click on your OAuth Client ID
4. Copy the "Client Secret" value

**Security:**
- ⚠️ **NEVER** commit this to git
- ⚠️ **NEVER** expose it in frontend code
- Only use in backend environment variables

**What happens if it's wrong:**
- Google rejects authentication requests
- OAuth flow fails
- Users can't sign in

---

## Summary: Required vs Optional

### ✅ Required for Basic Functionality:
- `DATABASE_URL` - Database connection
- `NODE_ENV` - Environment mode
- `SESSION_SECRET` - Session security
- `JWT_SECRET` - Token security

### ✅ Required for Authentication:
- `GOOGLE_CLIENT_ID` - Google OAuth
- `GOOGLE_CLIENT_SECRET` - Google OAuth
- `BASE_URL` - OAuth redirects
- `FRONTEND_URL` - CORS security

### ⚙️ Optional/Recommended:
- `PORT` - Server port (Railway may set automatically)
- `JWT_EXPIRES_IN` - Token expiration (has default)

---

## Security Best Practices

1. **Never commit secrets to git** - Use environment variables only
2. **Use different secrets for production** - Don't reuse development secrets
3. **Rotate secrets periodically** - Change them every few months
4. **Keep secrets long and random** - The ones I generated are secure
5. **Don't share secrets** - Treat them like passwords

---

## What Happens When You Deploy

1. Railway reads these environment variables
2. Your backend server starts
3. It connects to Supabase using `DATABASE_URL`
4. Database schema initializes automatically
5. Server starts listening on the port
6. Google OAuth is configured with your credentials
7. Frontend can now authenticate users and save data!
