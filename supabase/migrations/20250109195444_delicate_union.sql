/*
  # Budget Categories Setup

  1. New Categories
    - Updates main expense categories with descriptions
    - Adds recommended monthly budget ranges
    - Provides guidance for budget allocation

  2. Changes
    - Adds description column to main_expense_categories
    - Adds recommended_budget_min and recommended_budget_max columns
*/

-- Add new columns to main_expense_categories
ALTER TABLE main_expense_categories 
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS recommended_budget_min decimal(10,2),
ADD COLUMN IF NOT EXISTS recommended_budget_max decimal(10,2);

-- Update categories with descriptions and recommended budgets
UPDATE main_expense_categories SET
  description = 'Monthly income from all sources',
  recommended_budget_min = NULL,
  recommended_budget_max = NULL
WHERE id = 1;

UPDATE main_expense_categories SET
  description = 'Transportation expenses including fuel, maintenance, and public transit',
  recommended_budget_min = 200.00,
  recommended_budget_max = 500.00
WHERE id = 2;

UPDATE main_expense_categories SET
  description = 'Regular monthly bills and utilities',
  recommended_budget_min = 300.00,
  recommended_budget_max = 800.00
WHERE id = 3;

UPDATE main_expense_categories SET
  description = 'Expenses related to children including education and activities',
  recommended_budget_min = 200.00,
  recommended_budget_max = 1000.00
WHERE id = 4;

UPDATE main_expense_categories SET
  description = 'Educational expenses and professional development',
  recommended_budget_min = 50.00,
  recommended_budget_max = 300.00
WHERE id = 5;

UPDATE main_expense_categories SET
  description = 'Financial services, fees, and investments',
  recommended_budget_min = 100.00,
  recommended_budget_max = 500.00
WHERE id = 6;

UPDATE main_expense_categories SET
  description = 'Food and dining expenses including groceries and restaurants',
  recommended_budget_min = 400.00,
  recommended_budget_max = 800.00
WHERE id = 7;

UPDATE main_expense_categories SET
  description = 'Healthcare and wellness expenses',
  recommended_budget_min = 100.00,
  recommended_budget_max = 400.00
WHERE id = 8;

UPDATE main_expense_categories SET
  description = 'Housing expenses including rent/mortgage and maintenance',
  recommended_budget_min = 800.00,
  recommended_budget_max = 2000.00
WHERE id = 9;

UPDATE main_expense_categories SET
  description = 'Personal shopping and discretionary spending',
  recommended_budget_min = 100.00,
  recommended_budget_max = 400.00
WHERE id = 10;

UPDATE main_expense_categories SET
  description = 'Money transfers between accounts',
  recommended_budget_min = NULL,
  recommended_budget_max = NULL
WHERE id = 11;

UPDATE main_expense_categories SET
  description = 'Travel, entertainment, and lifestyle expenses',
  recommended_budget_min = 100.00,
  recommended_budget_max = 500.00
WHERE id = 12;