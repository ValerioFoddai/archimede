-- Drop the incorrect column
ALTER TABLE transactions
DROP COLUMN IF EXISTS bank_account;

-- Create transaction_bank_accounts table
CREATE TABLE IF NOT EXISTS transaction_bank_accounts (
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    bank_account_id UUID REFERENCES user_bank_accounts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (transaction_id, bank_account_id)
);

-- Drop existing view
DROP VIEW IF EXISTS user_transactions;

-- Recreate view with bank account join
CREATE VIEW user_transactions AS
SELECT 
    t.id,
    t.date,
    t.merchant,
    t.amount,
    t.main_category_id,
    t.sub_category_id,
    t.notes,
    t.user_id,
    t.created_at,
    t.updated_at,
    uba.account_name as bank_account,
    uba.id as bank_account_id
FROM transactions t
LEFT JOIN transaction_bank_accounts tba ON t.id = tba.transaction_id
LEFT JOIN user_bank_accounts uba ON tba.bank_account_id = uba.id;
