-- Enable RLS on user_bank_accounts if not already enabled
ALTER TABLE user_bank_accounts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own bank accounts" ON user_bank_accounts;
DROP POLICY IF EXISTS "Users can insert their own bank accounts" ON user_bank_accounts;
DROP POLICY IF EXISTS "Users can update their own bank accounts" ON user_bank_accounts;
DROP POLICY IF EXISTS "Users can delete their own bank accounts" ON user_bank_accounts;

-- Create policies
CREATE POLICY "Users can view their own bank accounts"
ON user_bank_accounts
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bank accounts"
ON user_bank_accounts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bank accounts"
ON user_bank_accounts
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bank accounts"
ON user_bank_accounts
FOR DELETE
USING (auth.uid() = user_id);

-- Add comment to table
COMMENT ON TABLE user_bank_accounts IS 'Stores user bank accounts with proper RLS policies';
