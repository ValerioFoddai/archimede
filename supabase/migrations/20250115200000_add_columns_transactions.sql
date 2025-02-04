-- Create columns_transactions table
CREATE TABLE columns_transactions (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    column_name VARCHAR(255) NOT NULL,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, column_name)
);

-- Create function to initialize column preferences for new users
CREATE OR REPLACE FUNCTION initialize_column_preferences()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert default column preferences for the new user
    INSERT INTO columns_transactions (user_id, column_name, is_visible)
    VALUES
        (NEW.id, 'Bank', true),
        (NEW.id, 'Category', true),
        (NEW.id, 'Tags', true),
        (NEW.id, 'Notes', true);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to initialize column preferences for new users
CREATE TRIGGER on_auth_user_created_columns_init
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION initialize_column_preferences();

-- Add RLS policies
ALTER TABLE columns_transactions ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own column preferences
CREATE POLICY "Users can manage their own column preferences"
    ON columns_transactions
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON columns_transactions
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

-- Add indexes
CREATE INDEX idx_columns_transactions_user_id ON columns_transactions(user_id);

-- Down Migration
-- Create a separate version to avoid conflicts with the up migration
CREATE OR REPLACE FUNCTION drop_column_preferences()
RETURNS void AS $$
BEGIN
    -- Drop all objects created in the up migration
    DROP TRIGGER IF EXISTS on_auth_user_created_columns_init ON auth.users;
    DROP FUNCTION IF EXISTS initialize_column_preferences();
    DROP TRIGGER IF EXISTS set_timestamp ON columns_transactions;
    DROP TABLE IF EXISTS columns_transactions;
END;
$$ LANGUAGE plpgsql;
