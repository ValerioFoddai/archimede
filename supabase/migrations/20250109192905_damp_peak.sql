/*
  # Create budgets tables

  1. New Tables
    - `user_budgets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `main_category_id` (int, references main_expense_categories)
      - `amount` (decimal)
      - `recurring` (boolean)
      - `start_date` (date)
      - `end_date` (date, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_budgets` table
    - Add policies for authenticated users to manage their budgets
*/

-- Create user_budgets table
CREATE TABLE user_budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  main_category_id int REFERENCES main_expense_categories(id) NOT NULL,
  amount decimal(10,2) NOT NULL CHECK (amount > 0),
  recurring boolean DEFAULT true NOT NULL,
  start_date date NOT NULL,
  end_date date,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT unique_user_category UNIQUE (user_id, main_category_id)
);

-- Enable RLS
ALTER TABLE user_budgets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own budgets"
  ON user_budgets
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own budgets"
  ON user_budgets
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budgets"
  ON user_budgets
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budgets"
  ON user_budgets
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_user_budgets_updated_at
  BEFORE UPDATE ON user_budgets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();