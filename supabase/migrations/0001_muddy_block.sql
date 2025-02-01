/*
  # User Profiles Schema

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `first_name` (varchar, required)
      - `last_name` (varchar, required)
      - `email` (varchar, required)
      - Various optional profile fields
      - Timestamps for created_at and updated_at

  2. Security
    - Enable RLS on user_profiles table
    - Add policies for:
      - Select: Users can read their own profile
      - Insert: Users can create their own profile
      - Update: Users can update their own profile

  3. Triggers
    - Create trigger to sync user data between auth.users and user_profiles
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  first_name varchar(50) NOT NULL,
  last_name varchar(50) NOT NULL,
  email varchar(255) NOT NULL UNIQUE,
  country varchar(100),
  city varchar(100),
  currency varchar(10),
  job_title varchar(100),
  phone_number varchar(50),
  date_of_birth date,
  profile_picture_url varchar(500),
  bio text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to handle user profile updates
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  email_name text;
BEGIN
  -- Extract name from email (part before @)
  email_name := split_part(NEW.email, '@', 1);
  
  -- Try to update existing profile first
  UPDATE public.user_profiles 
  SET user_id = NEW.id,
      first_name = email_name,
      last_name = 'User'
  WHERE email = NEW.email;
  
  -- If no rows were updated, insert new profile
  IF NOT FOUND THEN
    INSERT INTO public.user_profiles (user_id, first_name, last_name, email)
    VALUES (
      NEW.id,
      email_name,  -- Use email name as first name
      'User',      -- Default last name
      NEW.email
    );
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE handle_new_user();
