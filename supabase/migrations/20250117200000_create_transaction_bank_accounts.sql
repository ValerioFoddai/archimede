-- Create transaction_bank_accounts table
CREATE TABLE transaction_bank_accounts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id uuid NOT NULL,
    user_bank_accounts_id integer NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT fk_transaction 
        FOREIGN KEY (transaction_id) 
        REFERENCES user_transactions(id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_user_bank_account 
        FOREIGN KEY (user_bank_accounts_id) 
        REFERENCES user_bank_accounts(id) 
        ON DELETE RESTRICT
);

-- Create indexes for foreign keys to improve query performance
CREATE INDEX idx_transaction_bank_accounts_transaction_id 
    ON transaction_bank_accounts(transaction_id);
CREATE INDEX idx_transaction_bank_accounts_user_bank_account_id 
    ON transaction_bank_accounts(user_bank_accounts_id);

-- Add comment to table
COMMENT ON TABLE transaction_bank_accounts IS 'Maps transactions to bank accounts, establishing relationships between user_transactions and user_bank_accounts';

-- Enable Row Level Security
ALTER TABLE transaction_bank_accounts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own transaction bank account mappings"
    ON transaction_bank_accounts
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_transactions t
            JOIN user_bank_accounts ba ON ba.id = transaction_bank_accounts.user_bank_accounts_id
            WHERE t.id = transaction_bank_accounts.transaction_id
            AND t.user_id = auth.uid()
            AND ba.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create transaction bank account mappings for their own transactions and accounts"
    ON transaction_bank_accounts
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 
            FROM user_transactions t, user_bank_accounts ba
            WHERE t.id = transaction_id
            AND ba.id = user_bank_accounts_id
            AND t.user_id = auth.uid()
            AND ba.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own transaction bank account mappings"
    ON transaction_bank_accounts
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 
            FROM user_transactions t, user_bank_accounts ba
            WHERE t.id = transaction_bank_accounts.transaction_id
            AND ba.id = transaction_bank_accounts.user_bank_accounts_id
            AND t.user_id = auth.uid()
            AND ba.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 
            FROM user_transactions t, user_bank_accounts ba
            WHERE t.id = transaction_id
            AND ba.id = user_bank_accounts_id
            AND t.user_id = auth.uid()
            AND ba.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own transaction bank account mappings"
    ON transaction_bank_accounts
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM user_transactions t
            JOIN user_bank_accounts ba ON ba.id = transaction_bank_accounts.user_bank_accounts_id
            WHERE t.id = transaction_bank_accounts.transaction_id
            AND t.user_id = auth.uid()
            AND ba.user_id = auth.uid()
        )
    );
