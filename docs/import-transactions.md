# Import Transactions Flow

## Overview

The transaction import system supports multiple banks and formats, with a flexible mapping system that allows for easy addition of new import sources. The import flow is handled by components in `src/components/transactions/import/` and logic in `src/lib/import/`.

## Supported Banks

### Hype Bank
Implementation: `src/lib/import/banks/hype.ts`
- CSV format support
- Default column mappings:
  - Date: Transaction date
  - Description: Transaction description
  - Amount: Transaction amount
  - Category: Bank's category (mapped to internal categories)
- Automatic currency detection
- UTF-8 encoding required

### Fineco Bank
Implementation: `src/lib/import/banks/fineco.ts`
- CSV format support
- Default column mappings:
  - Data contabile: Accounting date
  - Data operazione: Operation date
  - Entrate: Income amount
  - Uscite: Expense amount
  - Descrizione: Transaction description
  - Categoria: Bank's category
- Euro currency
- Semicolon delimiter
- Windows-1252 encoding support

## Import Process

### 1. File Upload
Component: `src/components/transactions/import/file-upload.tsx`
- Handles file selection
- Initial validation
- File type checking
- Size limits
- Encoding detection

### 2. Bank Selection
Component: `src/components/transactions/import/bank-grid.tsx`
- Bank template selection
- Displays supported banks
- Shows bank-specific import instructions
- Validates file format against bank requirements

### 3. Column Mapping
Component: `src/components/transactions/import/column-mapping.tsx`
- Maps CSV columns to application fields
- Saves mapping templates
- Validates required fields
- Handles custom field mapping

### 4. Data Preview
Component: `src/components/transactions/import/import-preview.tsx`
- Shows parsed transaction data
- Allows data correction
- Validates transaction format
- Highlights potential issues

### 5. Import Summary
Component: `src/components/transactions/import/import-summary.tsx`
- Displays import statistics
- Shows duplicate detection results
- Provides final confirmation
- Handles import execution

## Mapping System

### Mapping Storage
Implementation: `src/lib/import/mapping-storage.ts`
- Persists mapping templates
- Handles mapping versioning
- User-specific mappings
- Default mappings per bank

### Duplicate Detection
Implementation: `src/lib/import/duplicate-checker.ts`
- Checks for existing transactions
- Uses multiple criteria:
  - Date matching
  - Amount matching
  - Description similarity
  - Bank reference numbers
- Configurable matching threshold

## Error Handling

### Common Issues
- Invalid file format
- Encoding issues
- Missing required fields
- Duplicate transactions
- Invalid amounts or dates

### Error Recovery
- Detailed error messages
- Suggested fixes
- Partial import support
- Manual correction options

## Adding New Banks

To add support for a new bank:

1. Create bank configuration:
   ```typescript
   // src/lib/import/banks/new-bank.ts
   export const newBankConfig = {
     name: "New Bank",
     fileType: "csv",
     encoding: "utf-8",
     delimiter: ",",
     defaultMapping: {
       date: "Transaction Date",
       description: "Description",
       amount: "Amount",
       // ... other fields
     }
   };
   ```

2. Add parser customization if needed
3. Create default mapping template
4. Update bank selection grid
5. Add bank-specific validation rules

## Import Flow Hooks

### useImport
Location: `src/hooks/useImport.ts`
- Manages import state
- Handles file processing
- Coordinates mapping
- Executes import

### Customization Points
- Column mapping rules
- Validation rules
- Duplicate detection settings
- Error handling
- Data transformation
