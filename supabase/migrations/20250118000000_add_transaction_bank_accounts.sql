-- Add bank_account column to transactions table
ALTER TABLE transactions
ADD COLUMN bank_account TEXT;
