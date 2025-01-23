-- Drop existing view
DROP VIEW IF EXISTS user_transactions;

-- Recreate view with bank_account column
CREATE VIEW user_transactions AS
SELECT 
    t.id,
    t.date,
    t.merchant,
    t.amount,
    t.main_category_id,
    t.sub_category_id,
    t.notes,
    t.bank_account,
    t.user_id,
    t.created_at,
    t.updated_at
FROM transactions t;
