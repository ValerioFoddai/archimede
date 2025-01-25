-- Drop existing view since it depends on the tables
DROP VIEW IF EXISTS user_transactions;

-- Drop existing foreign key constraint
ALTER TABLE transaction_bank_accounts 
DROP CONSTRAINT IF EXISTS fk_user_bank_account;

-- Add new foreign key constraint with ON DELETE CASCADE
-- Using CASCADE instead of SET NULL since we want to remove the mapping entirely
ALTER TABLE transaction_bank_accounts 
ADD CONSTRAINT fk_user_bank_account 
FOREIGN KEY (user_bank_accounts_id) 
REFERENCES user_bank_accounts(id) 
ON DELETE CASCADE;

-- Recreate user_transactions view
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
    tba.user_bank_accounts_id::text as bank_account_id,
    CASE 
        WHEN tba.user_bank_accounts_id IS NULL THEN NULL
        ELSE uba.account_name
    END as bank_account
FROM transactions t
LEFT JOIN transaction_bank_accounts tba ON t.id = tba.transaction_id
LEFT JOIN user_bank_accounts uba ON tba.user_bank_accounts_id = uba.id;

-- Add comment to view
COMMENT ON VIEW user_transactions IS 'View that shows transactions with their associated bank accounts, handling null bank accounts';
