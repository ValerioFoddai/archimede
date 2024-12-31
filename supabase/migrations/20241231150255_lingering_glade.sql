/*
  # Create banks table
  
  1. New Tables
    - `banks`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `banks` table
    - Add policy for authenticated users to read banks data
*/

-- Create banks table
CREATE TABLE IF NOT EXISTS banks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE banks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to read banks data
CREATE POLICY "Allow read access for authenticated users"
  ON banks
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert initial bank data
INSERT INTO banks (name) VALUES
  ('Hype'),
  ('Fineco'),
  ('Banca Sella');