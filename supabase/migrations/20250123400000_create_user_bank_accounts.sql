-- Create user_bank_accounts table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_bank_accounts (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    bank_id TEXT NOT NULL REFERENCES banks(id) ON DELETE RESTRICT,
    account_name TEXT NOT NULL,
    balance DECIMAL(15,2) NOT NULL DEFAULT 0,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, account_name)
);

-- Enable Row Level Security
ALTER TABLE user_bank_accounts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own bank accounts"
    ON user_bank_accounts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bank accounts"
    ON user_bank_accounts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bank accounts"
    ON user_bank_accounts FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bank accounts"
    ON user_bank_accounts FOR DELETE
    USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_user_bank_accounts_user_id ON user_bank_accounts(user_id);

-- Add comment to table
COMMENT ON TABLE user_bank_accounts IS 'Stores user bank accounts with proper RLS policies';
