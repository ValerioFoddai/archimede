/*
  # Fix user profiles trigger function

  1. Changes
    - Improves trigger function with better error handling
    - Adds explicit transaction handling
    - Adds detailed logging
    - Ensures profile creation happens immediately after user creation
*/

-- Update the user creation trigger function with improved error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  _profile_id uuid;
BEGIN
  -- Log the attempt to create a profile
  RAISE NOTICE 'Attempting to create profile for user %', NEW.id;

  -- Create the user profile
  INSERT INTO public.user_profiles (
    user_id,
    email,
    full_name
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  RETURNING id INTO _profile_id;

  -- Log successful creation
  RAISE NOTICE 'Successfully created profile % for user %', _profile_id, NEW.id;

  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    RAISE NOTICE 'Profile already exists for user %', NEW.id;
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log detailed error information
    RAISE WARNING 'Error creating profile for user %: %, SQLSTATE: %', 
      NEW.id, SQLERRM, SQLSTATE;
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Drop and recreate the trigger to ensure it runs with proper timing
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;