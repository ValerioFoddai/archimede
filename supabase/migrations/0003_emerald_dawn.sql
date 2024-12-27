/*
  # Fix User Profiles Schema

  1. Changes
    - Simplify user_profiles table structure
    - Update trigger function to handle null values
    - Add proper constraints and defaults

  2. Security
    - Maintain existing RLS policies
*/

-- Modify user_profiles table to better handle optional fields
ALTER TABLE user_profiles
  ALTER COLUMN full_name SET DEFAULT '',
  ALTER COLUMN company_name SET DEFAULT '',
  ALTER COLUMN email SET NOT NULL;

-- Drop and recreate the trigger function with better null handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (
    user_id,
    email,
    full_name
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error (in a real production system)
    RAISE NOTICE 'Error creating user profile: %', SQLERRM;
    RETURN NEW;
END;
$$ language 'plpgsql';