-- Create banks table if it doesn't exist
CREATE TABLE IF NOT EXISTS banks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE banks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to read banks
CREATE POLICY "Allow authenticated users to read banks"
    ON banks FOR SELECT
    TO authenticated
    USING (true);

-- Add Banca Sella and other banks
INSERT INTO banks (id, name)
VALUES 
    ('banca-sella', 'Banca Sella Import'),
    ('fineco', 'Fineco Bank Import'),
    ('hype', 'Hype Bank Import'),
    ('custom-csv', 'Custom CSV Import')
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name;
