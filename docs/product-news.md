# Product News

The Product News feature keeps users informed about new releases, updates, and improvements to Archimede. Each release is categorized by version type and includes detailed information about changes and enhancements.

## Version Types

Releases follow semantic versioning (MAJOR.MINOR.PATCH) with the following guidelines:

- **Major Releases** (e.g., 2.0.0)
  - Significant changes or redesigns
  - Breaking changes that may require migrations
  - Major new features that fundamentally change the application

- **Minor Releases** (e.g., 1.1.0)
  - New features that maintain backward compatibility
  - Substantial improvements to existing functionality
  - Non-breaking changes that enhance the user experience

- **Patch Releases** (e.g., 1.0.1)
  - Bug fixes
  - Minor UI updates
  - Small improvements that don't add new features
  - Documentation updates

## Notification System

- A bell icon in the top navigation bar shows the latest updates
- A red badge appears when there are unread updates
- Clicking the icon opens the Product News dialog
- Updates are marked as read when viewing them

## Database Structure

The feature uses two main tables:

### product_news
- Stores release information including:
  - Version number
  - Version type (major/minor/patch)
  - Title and description
  - List of changes
  - Publication date

### user_news_views
- Tracks which users have viewed which releases
- Used to manage the notification badge
- Automatically updated when users view releases

## Implementation Details

The Product News feature is implemented using:

- React components for the UI (ProductNewsIcon and ProductNewsDialog)
- Custom hook (useProductNews) for state management
- Supabase for data storage and real-time updates
- Tailwind CSS for styling

## Adding New Releases

New releases are added through database migrations. Each release should include:

1. Version number following semantic versioning
2. Appropriate version type
3. Clear title and description
4. List of changes in bullet points
5. Publication timestamp

Example migration:
```sql
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
  'Description of the release',
  jsonb_build_array(
    'Change 1',
    'Change 2'
  ),
  NOW()
);
