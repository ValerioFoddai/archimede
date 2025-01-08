/*
  # Add transactions tables and policies

  1. Tables
    - user_transactions
      - id (uuid, primary key)
      - date (date)
      - merchant (text)
      - amount (decimal)
      - main_category_id (int, foreign key)
      - sub_category_id (int, foreign key)
      - bank_id (uuid, foreign key)
      - notes (text)
      - user_id (uuid, foreign key)
      - created_at (timestamptz)

    - transaction_tags
      - transaction_id (uuid, foreign key)
      - tag_id (uuid, foreign key)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for CRUD operations
*/

-- Create user_transactions table
CREATE TABLE IF NOT EXISTS user_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  merchant text NOT NULL,
  amount decimal(10,2) NOT NULL,
  main_category_id int REFERENCES main_expense_categories(id),
  sub_category_id int REFERENCES sub_expense_categories(id),
  bank_id uuid REFERENCES banks(id),
  notes text,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT valid_amount CHECK (amount != 0),
  CONSTRAINT valid_category_relationship CHECK (
    (main_category_id IS NULL AND sub_category_id IS NULL) OR
    (main_category_id IS NOT NULL AND sub_category_id IS NOT NULL)
  )
);

-- Create transaction_tags table
CREATE TABLE IF NOT EXISTS transaction_tags (
  transaction_id uuid REFERENCES user_transactions(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES user_tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (transaction_id, tag_id)
);

-- Enable Row Level Security
ALTER TABLE user_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for user_transactions
CREATE POLICY "Users can view their own transactions"
  ON user_transactions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions"
  ON user_transactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
  ON user_transactions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
  ON user_transactions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for transaction_tags
CREATE POLICY "Users can view their transaction tags"
  ON transaction_tags
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_transactions
      WHERE user_transactions.id = transaction_tags.transaction_id
      AND user_transactions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their transaction tags"
  ON transaction_tags
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_transactions
      WHERE user_transactions.id = transaction_tags.transaction_id
      AND user_transactions.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_transactions_user_id ON user_transactions(user_id);
CREATE INDEX idx_transactions_date ON user_transactions(date);
CREATE INDEX idx_transactions_main_category ON user_transactions(main_category_id);
CREATE INDEX idx_transactions_sub_category ON user_transactions(sub_category_id);
CREATE INDEX idx_transactions_bank ON user_transactions(bank_id);
CREATE INDEX idx_transaction_tags_tag ON transaction_tags(tag_id);