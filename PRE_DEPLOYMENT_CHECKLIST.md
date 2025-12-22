# Pre-Deployment Checklist

This checklist covers all actions needed before redeploying after the database and JWT implementation.

## 🔴 Critical: Database Setup

### 1. Set Up Production Database

You **MUST** have a PostgreSQL database set up in production before deploying.

**Options:**

- **Railway**: Provides PostgreSQL as an addon (recommended)
- **Heroku Postgres**: Add PostgreSQL addon to your Heroku app
- **Render**: PostgreSQL database service
- **Supabase**: Free PostgreSQL hosting
- **AWS RDS / Google Cloud SQL**: For larger deployments

### 2. Get Your Database Connection URL

Format: `postgresql://username:password@host:port/database`

Example:

```
postgresql://brokerforce:password123@host.railway.app:5432/railway
```

---

## 🔴 Critical: New Environment Variables

### Backend (.env or Production Platform)

You **MUST** add these new environment variables to your backend:

#### Required New Variables:

```env
# Database - REQUIRED (replaces in-memory storage)
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT - REQUIRED (for token-based authentication)
JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-very-secure-min-32-chars
JWT_EXPIRES_IN=7d
```

#### Complete Backend Environment Variables List:

```env
# Google OAuth (existing)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Session (existing)
SESSION_SECRET=your-super-secret-session-key-change-this

# Server Config (existing)
PORT=3001
NODE_ENV=production

# URLs (existing - update for production)
BASE_URL=https://your-auth-server-domain.com
FRONTEND_URL=https://rebrokerforceai.netlify.app

# Database (NEW - REQUIRED)
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT (NEW - REQUIRED)
JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-very-secure
JWT_EXPIRES_IN=7d
```

### Frontend (.env.local or Netlify)

No new variables required! Existing variables still work:

```env
VITE_AUTH_SERVER_URL=https://your-auth-server-domain.com

# Optional - Only if using SimplyRETS API
VITE_SIMPLYRETS_API_URL=https://api.simplyrets.com
VITE_SIMPLYRETS_API_KEY=your_api_key
VITE_SIMPLYRETS_SECRET=your_secret
```

---

## ⚠️ Important: Database Schema Initialization

### Before First Deploy:

After deploying, you need to initialize the database schema. You have two options:

#### Option 1: Run Schema Manually (Recommended for first deploy)

1. Connect to your production database
2. Run the schema file:

```bash
# If you have psql access:
psql $DATABASE_URL < google-login-demo/db/schema.sql

# Or use a database GUI tool (pgAdmin, TablePlus, etc.)
# Copy and paste contents of google-login-demo/db/schema.sql
```

#### Option 2: Add Schema Migration to Deployment Script

Create a startup script that checks and initializes schema if needed.

---

## 📦 Dependencies

### Backend Dependencies

These new packages were added and will be installed automatically:

- `pg` - PostgreSQL client
- `jsonwebtoken` - JWT token handling
- `uuid` - UUID generation
- `cookie-parser` - Cookie parsing
- `bcryptjs` - Password hashing (for future use)

**Action**: No manual install needed - `npm install` will handle it during deployment.

---

## 🔐 Security Recommendations

### JWT_SECRET

Generate a strong, random secret:

```bash
# Generate a secure random string (32+ characters recommended)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or use an online generator: https://randomkeygen.com/

**⚠️ IMPORTANT**:

- Never commit JWT_SECRET to git
- Use different secrets for development and production
- Store securely in your hosting platform's environment variables

---

## ✅ Deployment Steps

### For Backend (Railway/Heroku/Render):

1. **Set Environment Variables:**

   ```bash
   # Railway: Use dashboard Variables tab
   # Heroku: heroku config:set KEY=value
   # Render: Use dashboard Environment tab

   # Add these NEW variables:
   DATABASE_URL=your_production_database_url
   JWT_SECRET=your_generated_secret
   JWT_EXPIRES_IN=7d
   ```

2. **Connect Database:**

   - Add PostgreSQL service if not already added
   - Copy connection URL to `DATABASE_URL`

3. **Initialize Database Schema:**

   - Connect to production database
   - Run `google-login-demo/db/schema.sql`

4. **Deploy:**
   - Push code or trigger deployment
   - Monitor logs for database connection success

### For Frontend (Netlify):

1. **Verify Environment Variables:**

   - Check `VITE_AUTH_SERVER_URL` is set to production backend URL
   - No new variables needed

2. **Deploy:**
   - Push code or trigger deployment
   - Build should complete normally

---

## 🧪 Testing Checklist

After deployment, test these features:

- [ ] Google OAuth login works
- [ ] User can add properties to favorites
- [ ] Favorites persist after refresh
- [ ] Dashboard loads and shows statistics
- [ ] User can access their saved favorites
- [ ] Database connection is working (check backend logs)

---

## 🐛 Troubleshooting

### Database Connection Errors

**Error**: `Connection refused` or `ECONNREFUSED`

**Solution**:

- Verify `DATABASE_URL` is correct
- Check database is accessible from your hosting platform
- Verify database firewall allows connections from your host
- Check database credentials are correct

### Schema Not Found Errors

**Error**: `relation "users" does not exist`

**Solution**:

- Run database schema initialization
- Check that schema.sql was executed successfully
- Verify all tables exist: `\dt` in psql

### JWT Errors

**Error**: `Invalid token` or `JWT_SECRET missing`

**Solution**:

- Verify `JWT_SECRET` is set in environment variables
- Ensure secret is at least 32 characters
- Check no trailing spaces in environment variable value

---

## 📝 Summary

### Must Do Before Deploy:

1. ✅ Set up production PostgreSQL database
2. ✅ Add `DATABASE_URL` to backend environment variables
3. ✅ Add `JWT_SECRET` to backend environment variables
4. ✅ Add `JWT_EXPIRES_IN` to backend environment variables (optional, defaults to 7d)
5. ✅ Initialize database schema in production database
6. ✅ Verify all existing environment variables are still set

### Optional:

- Generate secure JWT_SECRET (recommended)
- Test database connection locally first
- Review database backup strategy

---

## 🔗 Related Documentation

- [SETUP_DATABASE.md](./SETUP_DATABASE.md) - Database setup guide
- [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) - Full environment setup
- [DEPLOY_AUTH_SERVER.md](./DEPLOY_AUTH_SERVER.md) - Backend deployment guide
