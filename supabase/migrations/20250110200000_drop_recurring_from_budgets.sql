-- Drop recurring column from user_budgets table if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'user_budgets'
        AND column_name = 'recurring'
    ) THEN
        ALTER TABLE user_budgets DROP COLUMN recurring;
    END IF;
END $$;
