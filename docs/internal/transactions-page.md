# Transactions Page Documentation

## Overview

The transactions page is the main interface for managing financial transactions in Archimede. It provides a comprehensive view of all transactions with filtering, editing, and bulk operations capabilities.

## Page Structure (`src/pages/transactions/index.tsx`)

### Components Layout

1. **Header Section**
   - Add transaction button
   - Import transactions button
   - Time filter dropdown
   - Bank filter dropdown (shows only when 2+ banks have transactions)
   - Column visibility settings

2. **Filter Section**
   - Search input
   - Category filter
   - Tag filter
   - Amount range filter

3. **Transaction List**
   - Column Order:
     * Checkbox for selection
     * Date
     * Bank (toggleable, shows bank name from transactions)
     * Merchant
     * Amount
     * Category (toggleable)
     * Tags (toggleable)
     * Notes (toggleable)
     * Actions
   - Bulk selection
   - Individual row actions
   - Pagination (planned)

## Component Integration

### Bank Filter

1. **Filter Behavior**
   - Only appears when transactions exist from 2 or more banks
   - Shows only banks that have associated transactions
   - Allows filtering between "All Banks" and individual banks
   - Updates transaction list automatically when bank is selected

### Transaction Dialog

1. **Add Transaction**
   ```typescript
   // Dialog state management
   const [open, setOpen] = useState(false);
   const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
   ```

2. **Edit Flow**
   - Dialog opens with selected transaction data
   - Form pre-populated with existing values
   - Changes tracked through form state
   - Updates handled by useTransactions hook

### Data Management

1. **Transaction Loading**
   ```typescript
   // Initial data load
   const { transactions, loading, uniqueBankIds } = useTransactions(timeRange, bankId);
   
   // Refresh on filter changes
   useEffect(() => {
     // Fetch transactions with current filters
   }, [timeRange, bankId, filters]);
   ```

2. **Filter Management**
   - Time range filter (month/custom range)
   - Bank filter (active banks only)
   - Search text filter
   - Category filter
   - Tag filter
   - Amount range filter

## User Interactions

### Transaction Operations

1. **Adding Transactions**
   - Click "Add Transaction" button
   - Fill form with transaction details
   - Submit creates new transaction
   - List automatically updates

2. **Editing Transactions**
   - Click edit icon on transaction row
   - Modify details in form
   - Submit updates transaction
   - List reflects changes immediately

3. **Deleting Transactions**
   - Individual delete through row action
   - Bulk delete through selection
   - Confirmation dialog for safety
   - Automatic list refresh

### Bulk Operations

1. **Selection**
   - Checkbox in header for all
   - Individual row checkboxes
   - Selected count display
   - Bulk action buttons

2. **Actions**
   - Delete selected
   - Update categories (planned)
   - Update tags (planned)
   - Export selected (planned)

## State Management

### Page State

1. **UI State**
   ```typescript
   interface PageState {
     selectedIds: string[];
     timeRange: TimeRange;
     bankId?: string;
     filters: FilterState;
     columnVisibility: ColumnVisibility;
   }
   ```

   Column visibility includes:
   ```typescript
   interface ColumnVisibility {
     category: boolean;
     tags: boolean;
     notes: boolean;
     bank: boolean;
   }
   ```

2. **Filter State**
   ```typescript
   interface FilterState {
     search: string;
     categories: number[];
     tags: string[];
     amountRange: {
       min?: number;
       max?: number;
     };
   }
   ```

### Data Flow

1. **Filter Changes**
   ```
   User changes filter
   → Update filter state
   → Trigger transaction refresh
   → Update transaction list
   ```

2. **Transaction Updates**
   ```
   User edits transaction
   → Submit form
   → Update in database
   → Refresh transaction list
   → Update UI
   ```

## Performance Optimizations

1. **Data Loading**
   - Debounced search
   - Cached filter results
   - Optimized SQL queries
   - Lazy loading of related data

2. **UI Optimizations**
   - Virtualized list (planned)
   - Memoized components
   - Optimized re-renders
   - Skeleton loading states

## Error Handling

1. **Network Errors**
   - Retry mechanisms
   - Error boundaries
   - User-friendly messages
   - Automatic recovery

2. **Validation Errors**
   - Form-level validation
   - Field-level validation
   - Clear error messages
   - Recovery suggestions

## Future Enhancements

1. **Planned Features**
   - Advanced filtering
   - Custom views
   - Saved searches
   - Export options
   - Batch editing

2. **UI Improvements**
   - Drag and drop reordering
   - Inline editing
   - Custom column arrangements
   - Enhanced mobile view

## Integration Points

1. **Import System**
   - Import dialog integration
   - Format mapping
   - Duplicate detection
   - Error handling

2. **Analytics System**
   - Transaction data aggregation
   - Category analysis
   - Trend visualization
   - Budget tracking

## Testing Strategy

1. **Unit Tests**
   - Component rendering
   - Hook behavior
   - Filter logic
   - Form validation

2. **Integration Tests**
   - Page interactions
   - Data flow
   - Error scenarios
   - Filter combinations
