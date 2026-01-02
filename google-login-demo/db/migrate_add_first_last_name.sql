-- Migration: Add first_name and last_name columns to users table
-- Run this if you have an existing database

-- Add first_name column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='users' AND column_name='first_name') THEN
    ALTER TABLE users ADD COLUMN first_name VARCHAR(255);
  END IF;
END $$;

-- Add last_name column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='users' AND column_name='last_name') THEN
    ALTER TABLE users ADD COLUMN last_name VARCHAR(255);
  END IF;
END $$;

-- Migrate existing name data to first_name and last_name
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

-- Make email NOT NULL if it isn't already
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
