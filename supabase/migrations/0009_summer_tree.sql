/*
  # Create expense categories tables

  1. New Tables
    - `main_expense_categories`
      - `id` (int, primary key)
      - `name` (text, not null)
      - `created_at` (timestamptz, default: now())
    - `sub_expense_categories`
      - `id` (int, primary key)
      - `main_category_id` (int, foreign key)
      - `name` (text, not null)
      - `created_at` (timestamptz, default: now())

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read data

  3. Data
    - Insert main categories
    - Insert sub-categories with proper relationships
*/

-- Create main_expense_categories table
CREATE TABLE IF NOT EXISTS main_expense_categories (
  id int PRIMARY KEY,
  name text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create sub_expense_categories table
CREATE TABLE IF NOT EXISTS sub_expense_categories (
  id int PRIMARY KEY,
  main_category_id int REFERENCES main_expense_categories(id) NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE main_expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_expense_categories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access for authenticated users on main categories"
  ON main_expense_categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access for authenticated users on sub categories"
  ON sub_expense_categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert main categories
INSERT INTO main_expense_categories (id, name) VALUES
  (1, 'Income'),
  (2, 'Auto & Transport'),
  (3, 'Bills'),
  (4, 'Children'),
  (5, 'Education'),
  (6, 'Financial'),
  (7, 'Food'),
  (8, 'Health & Wellness'),
  (9, 'House'),
  (10, 'Shopping'),
  (11, 'Transfer'),
  (12, 'Travel & Lifestyle');

-- Insert sub-categories with their corresponding main_category_id
INSERT INTO sub_expense_categories (id, main_category_id, name) VALUES
  -- Income
  (101, 1, 'Salary'),
  (102, 1, 'Investment'),
  (103, 1, 'Bonus'),
  
  -- Auto & Transport
  (201, 2, 'Fuel'),
  (202, 2, 'Maintenance'),
  (203, 2, 'Insurance'),
  (204, 2, 'Public Transport'),
  
  -- Bills
  (301, 3, 'Electricity'),
  (302, 3, 'Water'),
  (303, 3, 'Internet'),
  (304, 3, 'Phone'),
  
  -- Children
  (401, 4, 'Education'),
  (402, 4, 'Activities'),
  (403, 4, 'Supplies'),
  
  -- Education
  (501, 5, 'Tuition'),
  (502, 5, 'Books'),
  (503, 5, 'Courses'),
  
  -- Financial
  (601, 6, 'Bank Fees'),
  (602, 6, 'Interest'),
  (603, 6, 'Investment Fees'),
  
  -- Food
  (701, 7, 'Groceries'),
  (702, 7, 'Restaurants'),
  (703, 7, 'Takeout'),
  
  -- Health & Wellness
  (801, 8, 'Doctor'),
  (802, 8, 'Pharmacy'),
  (803, 8, 'Fitness'),
  
  -- House
  (901, 9, 'Rent/Mortgage'),
  (902, 9, 'Maintenance'),
  (903, 9, 'Furniture'),
  
  -- Shopping
  (1001, 10, 'Clothing'),
  (1002, 10, 'Electronics'),
  (1003, 10, 'Gifts'),
  
  -- Transfer
  (1101, 11, 'Credit Card Payment'),
  (1102, 11, 'Savings'),
  (1103, 11, 'Investment'),
  
  -- Travel & Lifestyle
  (1201, 12, 'Hotels'),
  (1202, 12, 'Transportation'),
  (1203, 12, 'Entertainment');