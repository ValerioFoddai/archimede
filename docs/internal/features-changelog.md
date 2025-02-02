# Archimede Features Changelog

This document tracks all features and changes implemented in Archimede. It serves as a source of truth for product documentation and release notes.

## Bank Import Features

### Banca Sella Integration (January 2024)
- CSV import support with field mapping
- Duplicate detection during import
- Column mapping interface with field suggestions
- Bulk delete capability for imported transactions
- Transaction categorization based on description patterns

### Fineco Integration (January 2024)
- Support for Fineco CSV exports
- Automatic field mapping for standard Fineco columns
- Date format handling specific to Fineco exports
- Transaction categorization with Fineco-specific rules

### Hype Integration (January 2024)
- Support for Hype transaction exports
- Merchant information extraction
- Transaction categorization with Hype-specific patterns
- Date and amount format handling for Hype exports

## Core Features

### Transaction Management
- Import transactions from supported banks
- View and filter transactions
- Delete single or multiple transactions
- Search transactions by description, amount, or date
- Sort transactions by any column

### Expense Categories
- Hierarchical category system
- Parent and sub-categories
- Category-based transaction filtering
- Category management in settings

### Custom Tags
- Create and manage custom tags
- Tag-based transaction filtering
- Tag management interface
- Tag color customization

### Analytics
- Transaction overview charts
- Spending by category visualization
- Time-based spending analysis
- Basic budget tracking

### User Interface
- Responsive dashboard layout
- Dark/light theme support
- Customizable transaction list columns
- Mobile-friendly design

## Security Features
- User authentication
- Secure data storage
- Session management
- Data privacy controls

### User Profile System Update (February 2025)
- Improved user profile creation during signup
- Automatic profile creation via database trigger with SECURITY DEFINER
- First name and last name synchronization from auth metadata
- Profile data structure:
  * User ID linked to auth.users
  * Email from signup
  * First name and last name from raw_user_meta_data
  * Additional profile fields optional
- Database implementation:
  * Secure trigger with explicit search_path
  * Non-blocking error handling
  * Automatic metadata extraction
  * Permission-safe execution
- Technical documentation:
  * Detailed trigger implementation in auth-triggers.md
  * Troubleshooting guides
  * Security best practices

## Product News Feature (January 2024)

### UI Components
- Megaphone icon in top navigation bar
- Red dot indicator for unread updates
- Dedicated product news page with infinite scrolling
- Version badges (patch/minor/major) for each release

### Core Functionality
- Static news data management in src/data/product-news.ts
- Local storage for tracking viewed status per user
- Infinite loading with 5 items per page
- Automatic marking of news as read when viewing

### Implementation Details
- React components:
  * ProductNewsIcon: Navigation bar icon with unread indicator
  * ProductNewsPage: Main page with infinite scroll
- Hooks:
  * useProductNews: State management and pagination
- Data Storage:
  * Local storage for view state
  * Static TypeScript file for news data
  * Version tracking for unread status

### User Experience
- Clean single scrollbar interface
- Smooth infinite loading
- Clear version categorization
- Detailed feature descriptions
- Chronological ordering of updates

## Transaction System Updates (January 2024)

### Bank Filter Enhancement (January 25, 2025)
- Added smart bank filter to transaction list
- Filter only appears when transactions from 2+ banks exist
- Shows only banks that have associated transactions
- Allows filtering between "All Banks" and individual banks
- Updates transaction list automatically when bank is selected
- Maintains clean interface by hiding filter when unnecessary

### Bank Column Updates (January 2024)
- Added bank column to transaction list
- Column positioned between Date and Merchant columns
- Bank name displayed without "Import" suffix
- Bank column toggleable through column visibility menu
- Bank information preserved from import process
- Migration path:
  * Bank ID preserved in transactions table
  * Bank names fetched from banks table
  * Column preferences updated to include bank visibility
- Import functionality:
  * Bank selection during import determines displayed bank name
  * Bank information stored with each transaction

## Assets Section Updates (January 2024)

### Placeholder Implementation
- Created dedicated Assets section with "Coming Soon" status
- Temporarily hidden sidebar while preserving code for future use
- Added informative placeholder content:
  * Clear messaging about upcoming features
  * Visual elements including Wallet icon
  * List of planned capabilities:
    - Multiple asset type tracking
    - Investment monitoring
    - Performance analytics
    - Comprehensive reporting
- Migration path:
  * Removed bank accounts page
  * Dropped transaction_bank_accounts table
  * Dropped user_bank_accounts table
  * Dropped user_bank_status view

### Analytics Integration
- Configured Vercel Analytics for proper development mode
- Reduced console noise by disabling debug mode
- Added environment-aware analytics configuration

## Notes for Documentation
When documenting features:
1. Be specific about capabilities (e.g., "bulk delete" not "bulk editing")
2. Include any limitations or requirements
3. Describe actual functionality, not planned features
4. Update this document when adding or modifying features
