-- Insert sample release notes
DO $$
BEGIN
  -- Check if the releases don't already exist
  IF NOT EXISTS (SELECT 1 FROM product_news WHERE version = '1.0.0') THEN
    INSERT INTO product_news (
      version,
      version_type,
      title,
      description,
      changes,
      published_at
    ) VALUES (
      '1.0.0',
      'major',
      'Initial Release',
      'Welcome to Archimede! This is our first official release with core financial management features.',
      jsonb_build_array(
        'Transaction management with import capabilities',
        'Budget tracking and analytics',
        'Expense categorization system',
        'User tags for custom organization',
        'Responsive dashboard with key insights'
      ),
      NOW()
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM product_news WHERE version = '1.1.0') THEN
    INSERT INTO product_news (
      version,
      version_type,
      title,
      description,
      changes,
      published_at
    ) VALUES (
      '1.1.0',
      'minor',
      'Enhanced Import Features',
      'New improvements to the transaction import system and UI enhancements.',
      jsonb_build_array(
        'Added support for Banca Sella imports',
        'Improved transaction matching algorithm',
        'Enhanced column mapping interface',
        'Added bulk edit capabilities for imported transactions'
      ),
      NOW()
    );
  END IF;
END;
$$;
