# Supabase Connection String Helper

## What You Need to Find

To build your connection string, you need:

1. **Your Supabase Project Reference ID** (found in the URL or project settings)
   - Example: If your URL is `https://abcdefghijklmnop.supabase.co`, then `abcdefghijklmnop` is your project ref

2. **Your Database Password** (the one you set when creating the project)
   - If you forgot it, you can reset it in Settings → Database

3. **Your Region** (optional, but helpful)
   - Found in Project Settings → General

## Connection String Format

Once you have the above, your connection string will be:

### For Connection Pooling (Recommended):
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true
```

### For Session Pooler:
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

## Where to Find Project Reference ID

1. **In the URL**: When you're in your project dashboard, the URL will be:
   `https://app.supabase.com/project/[PROJECT-REF]`

2. **In Project Settings**:
   - Go to Settings → General
   - Look for "Reference ID" or "Project ID"

## Steps to Get Connection String

### Option A: Via Settings → Database
1. Go to **Settings** (gear icon) → **Database**
2. Scroll down to find connection info
3. Look for tabs: "URI", "Connection Pooling", or "Connection String"
4. Copy the connection string

### Option B: Via Project Settings → API
1. Go to **Settings** → **API**
2. Note your **Project URL** (e.g., `https://xxxxx.supabase.co`)
3. Extract the project ref from the URL
4. Use the format above with your password

### Option C: Manual Construction
If you can't find it in the UI, provide me:
- Your project reference ID (from URL or settings)
- Your database password
- Your region (if visible)

And I'll give you the exact connection string!

## Testing the Connection

Once you have the connection string, you can test it locally before deploying to Railway.
