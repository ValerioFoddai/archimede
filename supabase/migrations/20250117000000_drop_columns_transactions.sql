-- Drop columns_transactions table and related objects
DROP TRIGGER IF EXISTS set_timestamp ON columns_transactions;
DROP FUNCTION IF EXISTS initialize_column_preferences();
DROP TABLE IF EXISTS columns_transactions;
