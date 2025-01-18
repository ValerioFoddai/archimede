-- Create an enum for version types
CREATE TYPE version_type AS ENUM ('patch', 'minor', 'major');

-- Create table for product news/releases
CREATE TABLE product_news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    version VARCHAR NOT NULL,
    version_type version_type NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT NOT NULL,
    changes JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create table to track which users have seen which releases
CREATE TABLE user_news_views (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    news_id UUID REFERENCES product_news(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, news_id)
);

-- Add indexes
CREATE INDEX idx_product_news_version ON product_news(version);
CREATE INDEX idx_product_news_published_at ON product_news(published_at);

-- Enable RLS but allow all authenticated users to access
ALTER TABLE product_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_news_views ENABLE ROW LEVEL SECURITY;

-- Create policies for product_news
CREATE POLICY "Allow authenticated users to read product news"
  ON product_news
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for user_news_views
CREATE POLICY "Allow users to manage their own views"
  ON user_news_views
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
