-- Complete Migration: Add username, first_name, and last_name columns to users table
-- Run this on your production Supabase database via SQL Editor

-- Step 1: Add username column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='username') THEN
    ALTER TABLE users ADD COLUMN username VARCHAR(50) UNIQUE;
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    
    -- Add username validation constraint
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints
                   WHERE constraint_name='check_username_format') THEN
      ALTER TABLE users ADD CONSTRAINT check_username_format CHECK (
        username IS NULL OR (
          LENGTH(username) >= 3 AND
          LENGTH(username) <= 20 AND
          username ~ '^[a-zA-Z0-9_-]+$'
        )
      );
    END IF;
  END IF;
END $$;

-- Step 2: Add first_name column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='first_name') THEN
    ALTER TABLE users ADD COLUMN first_name VARCHAR(255);
  END IF;
END $$;

-- Step 3: Add last_name column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='last_name') THEN
    ALTER TABLE users ADD COLUMN last_name VARCHAR(255);
  END IF;
END $$;

-- Step 4: Migrate existing name data to first_name and last_name
-- Split name on first space, first part goes to first_name, rest to last_name
DO $$ 
BEGIN
  UPDATE users 
  SET 
    first_name = CASE 
      WHEN name IS NOT NULL AND position(' ' in name) > 0 
      THEN substring(name from 1 for position(' ' in name) - 1)
      ELSE name
    END,
    last_name = CASE 
      WHEN name IS NOT NULL AND position(' ' in name) > 0 
      THEN substring(name from position(' ' in name) + 1)
      ELSE NULL
    END
  WHERE first_name IS NULL OR last_name IS NULL;
END $$;

-- Step 5: Make email NOT NULL if it isn't already
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name='users' AND column_name='email' 
             AND is_nullable='YES') THEN
    -- First, set any NULL emails to a placeholder (you may want to handle this differently)
    UPDATE users SET email = 'migrated_' || id || '@placeholder.com' WHERE email IS NULL;
    ALTER TABLE users ALTER COLUMN email SET NOT NULL;
  END IF;
END $$;

