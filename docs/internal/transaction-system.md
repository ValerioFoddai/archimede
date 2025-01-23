# Transaction System Documentation

## Overview

The transaction system in Archimede is built with a layered architecture that handles transaction management, bank account associations, and category/tag relationships. This document outlines how the different components work together.

## Database Structure

### Tables and Views

1. `user_transactions` (View)
   - Main view for transaction operations
   - Includes core transaction fields and bank account information
   - Used for all CRUD operations to ensure proper security and data relationships

2. `transaction_bank_accounts`
   - Maps transactions to bank accounts
   - Enables optional bank account associations
   - Uses ON DELETE CASCADE for automatic cleanup

3. `transaction_tags`
   - Stores transaction-tag relationships
   - Enables multiple tags per transaction
   - Uses ON DELETE CASCADE for automatic cleanup

## Component Architecture

### Transaction Form (`src/components/transactions/transaction-form/`)

1. **Main Form Component** (`index.tsx`)
   - Handles form state using react-hook-form
   - Manages transaction creation and updates
   - Coordinates with child components for specific fields

2. **Bank Account Select** (`bank-account-select.tsx`)
   - Manages bank account selection with numeric IDs
   - Handles "None" option with 'none' value
   - Converts string values to numbers for database compatibility
   - Uses Radix UI Select component with type-safe value handling

3. **Category Select** (`category-select.tsx`)
   - Manages main and sub-category selection
   - Hierarchical selection interface

4. **Tag Select** (`tag-select.tsx`)
   - Handles multiple tag selection
   - Manages tag creation and association

### Transaction List (`src/components/transactions/transaction-list.tsx`)
- Displays transactions in a table format
- Handles selection and bulk operations
- Provides edit and delete actions
- Supports column visibility preferences

## Data Flow

### Edit Transaction Flow

1. **Initialization**
   - User clicks edit button on transaction
   - Transaction form opens with pre-filled data
   - Form fields populated using transaction data

2. **Form Handling**
   - Form uses react-hook-form for state management
   - Each field component receives form control
   - Changes tracked through form state

3. **Update Process**
   ```typescript
   // Update sequence in useTransactions hook
   1. Update main transaction data
   2. Handle bank account association
   3. Update tag relationships
   4. Refresh transaction list
   ```

### Database Interactions

1. **Read Operations**
   ```sql
   -- Fetch transactions with relationships
   SELECT * FROM user_transactions
   WHERE user_id = auth.uid()
   ```

2. **Write Operations**
   ```sql
   -- Update transaction
   UPDATE user_transactions
   SET field = value
   WHERE id = transaction_id AND user_id = auth.uid()
   
   -- Update bank account
   DELETE FROM transaction_bank_accounts WHERE transaction_id = id;
   INSERT INTO transaction_bank_accounts (transaction_id, bank_account_id)
   VALUES (id, bank_account_id);
   
   -- Update tags
   DELETE FROM transaction_tags WHERE transaction_id = id;
   INSERT INTO transaction_tags (transaction_id, tag_id)
   VALUES (id, tag_id);
   ```

## Security Considerations

1. **Row Level Security (RLS)**
   - All tables have RLS policies
   - Users can only access their own data
   - Policies enforce user_id checks

2. **View-based Access**
   - user_transactions view enforces security
   - Direct table access prevented
   - Relationships maintained through foreign keys

## State Management

### Transaction Hook (`useTransactions.ts`)

1. **Core Functionality**
   - Manages transaction CRUD operations
   - Handles data transformation
   - Maintains loading states
   - Provides error handling

2. **Key Methods**
   ```typescript
   // Available methods
   createTransaction()  // Create new transaction
   updateTransaction()  // Update existing transaction
   deleteTransaction()  // Delete transaction
   applyTransactionRules()  // Apply auto-categorization
   ```

### Form State

1. **Form Data Structure**
   ```typescript
   interface TransactionFormData {
     date: Date;
     bankAccountId?: number | 'none';  // Numeric ID for bank accounts
     merchant: string;
     amount: string;
     mainCategoryId?: number;
     subCategoryId?: number;
     tagIds?: string[];
     notes?: string;
   }
   ```

2. **Bank Account Handling**
   ```typescript
   // Schema validation
   bankAccountId: z.union([z.literal('none'), z.number()]).optional()

   // Value transformation
   onValueChange={(value) => {
     field.onChange(value === 'none' ? 'none' : parseInt(value));
   }}

   // Database mapping
   if (data.bankAccountId && data.bankAccountId !== 'none') {
     user_bank_accounts_id: data.bankAccountId
   }
   ```

2. **Validation**
   - Uses zod schema validation
   - Enforces required fields
   - Validates data types and formats

## Error Handling

1. **Database Errors**
   - Caught in try/catch blocks
   - Displayed using toast notifications
   - Logged for debugging

2. **Form Validation**
   - Client-side validation using zod
   - Field-level error messages
   - Prevents invalid submissions

## Performance Considerations

1. **Data Loading**
   - Transactions fetched with relationships
   - Pagination planned for large datasets
   - Optimistic updates for better UX

2. **Caching**
   - Transaction data cached in state
   - Refreshed on updates
   - Event-based updates

## Future Improvements

1. **Planned Enhancements**
   - Implement transaction pagination
   - Add batch update capabilities
   - Enhance search and filtering
   - Improve performance for large datasets

2. **Technical Debt**
   - Consider implementing optimistic updates
   - Add more comprehensive error handling
   - Improve type safety
   - Add unit tests for critical paths
