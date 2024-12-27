/*
  # Fix User Profile Creation

  1. Changes
    - Add proper error handling for user profile creation
    - Ensure user profile is always created
    - Add constraints to prevent orphaned profiles

  2. Security
    - Maintain existing RLS policies
*/

-- Add a constraint to ensure user_id is unique
ALTER TABLE user_profiles
  ADD CONSTRAINT unique_user_id UNIQUE (user_id);

-- Create a more robust trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  profile_id uuid;
BEGIN
  -- Create user profile
  INSERT INTO public.user_profiles (
    user_id,
    email,
    full_name
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  RETURNING id INTO profile_id;

  -- Verify profile was created
  IF profile_id IS NULL THEN
    RAISE EXCEPTION 'Failed to create user profile';
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, ignore
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log error and re-raise
    RAISE NOTICE 'Error in handle_new_user: %', SQLERRM;
    RAISE;
END;
$$ language 'plpgsql';

-- Ensure trigger is properly set
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();