-- Drop existing view
DROP VIEW IF EXISTS user_transactions;

-- Recreate view with proper bank account join and type casting
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
    tba.user_bank_accounts_id as bank_account_id, -- Remove text casting
    uba.account_name as bank_account
FROM transactions t
LEFT JOIN transaction_bank_accounts tba ON t.id = tba.transaction_id
LEFT JOIN user_bank_accounts uba ON tba.user_bank_accounts_id = uba.id;

-- Add comment to view
COMMENT ON VIEW user_transactions IS 'View that shows transactions with their associated bank accounts';
