-- Drop the old unique constraint
ALTER TABLE user_budgets
DROP CONSTRAINT unique_user_category;

-- Add new unique constraint that includes start_date
ALTER TABLE user_budgets
ADD CONSTRAINT unique_user_category_month UNIQUE (user_id, main_category_id, start_date);
