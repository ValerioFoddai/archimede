-- Update the handle_new_user function to use raw_user_meta_data for full_name
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    (NEW.raw_user_meta_data->>'full_name')::text
  );
  RETURN NEW;
END;
$$ language 'plpgsql';
