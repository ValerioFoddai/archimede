/*
  # Add update timestamp function

  1. New Functions
    - `update_updated_at_column()`
      - Trigger function to automatically update updated_at timestamp
      - Used by multiple tables for timestamp management

  2. Changes
    - Creates a reusable function for timestamp updates
    - Ensures consistent timestamp handling across tables
*/

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';