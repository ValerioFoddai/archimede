-- Drop views first to avoid dependency issues
DROP VIEW IF EXISTS user_transactions;

-- Drop tables
DROP TABLE IF EXISTS transaction_bank_accounts;
DROP TABLE IF EXISTS user_bank_accounts;
DROP TABLE IF EXISTS user_bank_status;

-- Recreate user_transactions view without bank account
CREATE VIEW user_transactions AS
SELECT 
  t.id,
  t.date,
  t.merchant,
  t.amount,
  t.main_category_id as "mainCategoryId",
  t.sub_category_id as "subCategoryId",
  t.tag_ids as "tagIds",
  t.notes,
  t.user_id as "userId",
  t.created_at as "createdAt"
FROM transactions t;
