-- Migration: Add username and password_hash columns to users table
-- Run this if you have an existing database without these columns

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

-- Step 2: Add password_hash column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='password_hash') THEN
    ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);
  END IF;
END $$;
