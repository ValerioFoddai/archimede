-- Create tags table
CREATE TABLE tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on user_id for better query performance
CREATE INDEX idx_tags_user_id ON tags(user_id);

-- Enable Row Level Security
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to select only their own tags
CREATE POLICY "Users can view their own tags" ON tags
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own tags
CREATE POLICY "Users can insert their own tags" ON tags
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own tags
CREATE POLICY "Users can update their own tags" ON tags
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own tags
CREATE POLICY "Users can delete their own tags" ON tags
    FOR DELETE
    USING (auth.uid() = user_id);
