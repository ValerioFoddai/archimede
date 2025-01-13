/*
  # Create expense categories tables
  
  1. New Tables
    - `main_expense_categories`
      - `id` (int, primary key)
      - `name` (text, not null)
      - `created_at` (timestamptz)

    - `sub_expense_categories`
      - `id` (int, primary key)
      - `main_category_id` (int, foreign key)
      - `name` (text, not null)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read categories
*/

-- Create main_expense_categories table
CREATE TABLE IF NOT EXISTS main_expense_categories (
  id SERIAL PRIMARY KEY,
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create sub_expense_categories table
CREATE TABLE IF NOT EXISTS sub_expense_categories (
  id SERIAL PRIMARY KEY,
  main_category_id int REFERENCES main_expense_categories(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(main_category_id, name)
);

-- Enable Row Level Security
ALTER TABLE main_expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_expense_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for main_expense_categories
CREATE POLICY "Allow read access for authenticated users on main categories"
  ON main_expense_categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for sub_expense_categories
CREATE POLICY "Allow read access for authenticated users on sub categories"
  ON sub_expense_categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert initial expense categories
INSERT INTO main_expense_categories (name) VALUES
  ('Housing'),
  ('Transportation'),
  ('Food'),
  ('Utilities'),
  ('Insurance'),
  ('Healthcare'),
  ('Savings'),
  ('Personal'),
  ('Entertainment'),
  ('Other');

-- Insert initial sub-categories
INSERT INTO sub_expense_categories (main_category_id, name)
SELECT 
  m.id,
  s.name
FROM main_expense_categories m
CROSS JOIN (
  VALUES
    -- Housing
    (1, 'Rent'),
    (1, 'Mortgage'),
    (1, 'Property Tax'),
    (1, 'Home Maintenance'),
    -- Transportation
    (2, 'Car Payment'),
    (2, 'Gas'),
    (2, 'Public Transit'),
    (2, 'Car Maintenance'),
    -- Food
    (3, 'Groceries'),
    (3, 'Restaurants'),
    (3, 'Take Out'),
    -- Utilities
    (4, 'Electricity'),
    (4, 'Water'),
    (4, 'Gas'),
    (4, 'Internet'),
    (4, 'Phone'),
    -- Insurance
    (5, 'Health Insurance'),
    (5, 'Car Insurance'),
    (5, 'Home Insurance'),
    (5, 'Life Insurance'),
    -- Healthcare
    (6, 'Doctor'),
    (6, 'Dentist'),
    (6, 'Medication'),
    (6, 'Vision'),
    -- Savings
    (7, 'Emergency Fund'),
    (7, 'Retirement'),
    (7, 'Investment'),
    -- Personal
    (8, 'Clothing'),
    (8, 'Personal Care'),
    (8, 'Gym'),
    (8, 'Education'),
    -- Entertainment
    (9, 'Movies'),
    (9, 'Games'),
    (9, 'Hobbies'),
    (9, 'Subscriptions'),
    -- Other
    (10, 'Gifts'),
    (10, 'Donations'),
    (10, 'Miscellaneous')
) AS s(category_id, name)
WHERE m.id = s.category_id;

-- Create indexes for better performance
CREATE INDEX idx_sub_categories_main_category ON sub_expense_categories(main_category_id);
