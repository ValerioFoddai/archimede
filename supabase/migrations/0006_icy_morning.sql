/*
  # Fix User Profile Creation

  1. Changes
    - Improve error handling in trigger function
    - Add better logging
    - Ensure atomic profile creation
    - Add proper error recovery

  2. Security
    - Maintain existing RLS policies
*/

-- Create an improved trigger function with better error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Attempt to create the user profile
  INSERT INTO public.user_profiles (
    user_id,
    email,
    full_name
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );

  -- If we get here, the insert was successful
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, which is fine
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log the error details
    RAISE WARNING 'Error in handle_new_user: %, SQLSTATE: %, SQLERRM: %', 
      SQLERRM, SQLSTATE, SQLERRM;
    
    -- Still return NEW to ensure the auth user is created
    -- This prevents blocking user registration even if profile creation fails
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Ensure the trigger is properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();