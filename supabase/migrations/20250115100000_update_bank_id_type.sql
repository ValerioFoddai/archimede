-- Update bank_id column in user_transactions to use TEXT type
ALTER TABLE user_transactions 
  ALTER COLUMN bank_id TYPE TEXT USING bank_id::text;

-- Add foreign key constraint to banks table
ALTER TABLE user_transactions
  ADD CONSTRAINT fk_user_transactions_bank
  FOREIGN KEY (bank_id)
  REFERENCES banks(id)
  ON DELETE SET NULL;
