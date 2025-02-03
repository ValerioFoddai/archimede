-- Add Revolut bank
INSERT INTO banks (id, name)
VALUES ('revolut', 'Revolut Import')
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name;
