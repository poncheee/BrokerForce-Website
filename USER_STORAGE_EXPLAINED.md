# User Storage - How It Works

## ✅ Good News: User Data is Already Being Stored!

When a user signs in with Google, your backend automatically:

1. **Checks if user exists** in the `users` table (by Google ID)
2. **Creates new user** if they don't exist
3. **Updates user info** if they already exist
4. **Stores the data** in your Supabase PostgreSQL database

## How to Verify It's Working:

### Step 1: Check Railway Logs

1. Go to Railway → Your service → Deployments → Latest → View Logs
2. Look for messages like:
   - ✅ `New user created: [Name] ([Email])`
   - ✅ `User updated: [Name] ([Email])`

These messages confirm users are being saved!

### Step 2: Check Supabase Database

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Table Editor** (in left sidebar)
4. Click on **`users`** table
5. You should see user records there!

**Can you check if there are any users in the `users` table?**

---

## What Gets Stored:

When a user signs in, the following is saved to the `users` table:
- `id` - User ID (same as Google ID)
- `google_id` - Google user ID
- `name` - User's display name
- `email` - User's email
- `avatar` - User's profile picture URL
- `created_at` - When account was created
- `updated_at` - Last update time

---

## Database Schema:

Your database has these tables:
- ✅ `users` - User accounts
- ✅ `user_favorites` - Saved properties
- ✅ `purchase_requests` - Purchase requests
- ✅ `offers` - Property offers
- ✅ `documents` - Signed documents
- ✅ `payments` - Payment history

All of these are already set up in your Supabase database!

---

## Verify Database Schema is Initialized:

Check Railway logs for:
- ✅ `✅ Database schema initialized successfully!`

If you don't see this, the tables might not exist yet. Let me know and we can manually initialize them.

---

**Check your Supabase Table Editor - do you see a `users` table with any records?**
