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

## Notes for Documentation
When documenting features:
1. Be specific about capabilities (e.g., "bulk delete" not "bulk editing")
2. Include any limitations or requirements
3. Describe actual functionality, not planned features
4. Update this document when adding or modifying features
