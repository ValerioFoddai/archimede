/*
  # Fix user metadata handling

  1. Changes
    - Update user_profiles table structure to match auth metadata
    - Add proper handling of full name and company name
    - Update trigger to properly parse user metadata

  2. Security
    - Maintain existing RLS policies
*/

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Modify user_profiles table
ALTER TABLE user_profiles 
  DROP COLUMN IF EXISTS first_name,
  DROP COLUMN IF EXISTS last_name,
  ADD COLUMN IF NOT EXISTS full_name varchar(100),
  ADD COLUMN IF NOT EXISTS company_name varchar(100);

-- Create updated function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (
    user_id,
    email,
    full_name,
    company_name
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'company_name', '')
  );
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE handle_new_user();