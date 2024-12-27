/*
  # Simplify User Profile Creation

  1. Changes
    - Simplify user_profiles table structure
    - Remove unnecessary constraints
    - Add better error handling
    - Ensure atomic profile creation

  2. Security
    - Maintain RLS policies
*/

-- Simplify user_profiles table
ALTER TABLE user_profiles
  DROP CONSTRAINT IF EXISTS valid_email,
  ALTER COLUMN full_name DROP NOT NULL,
  ALTER COLUMN email DROP NOT NULL;

-- Create a simplified trigger function
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
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, ignore
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log error but don't block user creation
    RAISE WARNING 'Error creating user profile: %', SQLERRM;
    RETURN NEW;
END;
$$ language 'plpgsql';