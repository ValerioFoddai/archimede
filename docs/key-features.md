# Key Features

## Transaction Management

### Core Transaction Features
- Create, read, update, and delete transactions
- Bulk import from supported banks
- Categorization with expense categories
- Tag-based organization
- Notes and merchant information
- Advanced date filtering:
  - Monthly selection
  - Custom date range with visual calendar
  - Intuitive range selection interface
- Date and amount tracking
- Multi-currency support
- Customizable column visibility with persistence

### Column Visibility
Located in `src/components/transactions/columns-visibility/`:
- Configurable column display preferences
- Persistent settings per user
- Real-time UI updates
- Toggleable columns:
  - Category
  - Tags
  - Notes
- Database-backed preferences

### Transaction Form
The transaction form (`src/components/transactions/transaction-form/`) provides:
- Amount input with currency support
- Date picker
- Merchant autocomplete
- Category selection
- Tag management
- Notes field

## Expense Categories

### Category System
- Hierarchical category structure
- Parent and sub-categories
- Category-based reporting
- Budget tracking per category
- Custom category creation

### Category Management
Located in `src/components/expense-categories/`:
- Category creation and editing
- Sub-category management
- Category reordering
- Budget allocation

## Import System

### Supported Banks
- Hype Bank
- Fineco Bank
- Custom CSV imports

### Import Features
- Column mapping
- Data validation
- Duplicate detection
- Transaction categorization
- Import history
- Mapping templates

## Budget Management

### Budget Features
- Category-based budgets
- Monthly tracking
- Spending alerts
- Progress visualization
- Historical comparison

### Budget Components
Located in `src/pages/budgets/`:
- Budget creation
- Spending tracking
- Visual progress bars
- Alert configuration

## Analytics

### Reporting Features
Located in `src/pages/analytics/`:
- Cash flow analysis
- Expense category breakdown
- Monthly comparisons
- Trend analysis
- Advanced date filtering:
  - Monthly period selection
  - Interactive date range picker
  - Visual range selection calendar
  - Consistent interface with transactions

### Visualization Components
- Cash flow charts
- Category distribution
- Monthly comparisons
- Trend lines

## Tag System

### Tag Features
- Custom tag creation
- Color coding
- Tag grouping
- Transaction filtering
- Tag-based reporting

### Tag Management
Located in `src/components/tags/`:
- Tag CRUD operations
- Bulk tagging
- Tag search
- Tag history

## Authentication

### Auth Features
Located in `src/components/auth/`:
- Email/password authentication
- Social authentication
- Password recovery
- Session management
- Protected routes

## User Interface

### UI Components
Located in `src/components/ui/`:
- Custom button variants
- Form inputs
- Modals and dialogs
- Tables
- Cards
- Navigation components
- Toast notifications

### Layout System
Located in `src/components/layout/`:
- Responsive sidebar
- Top navigation
- Content layout
- Mobile optimization
