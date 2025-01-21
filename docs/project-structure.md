# Project Structure

## Directory Organization

```
src/
├── components/         # React components organized by feature
│   ├── auth/          # Authentication related components
│   ├── bank-accounts/ # Bank account management components
│   ├── expense-categories/
│   ├── layout/        # App layout components (sidebar, navigation)
│   ├── transactions/  # Transaction management components
│   ├── ui/           # Reusable UI components
│   └── user-tags/    # User tagging system components
├── hooks/            # Custom React hooks
├── lib/             # Utility functions and core logic
│   ├── import/      # Transaction import logic
│   └── validations/ # Form validation schemas
├── pages/           # Page components and routes
│   ├── analytics/   # Analytics and reporting
│   ├── assets/      # Asset management
│   │   ├── bank-accounts/# Bank account management
│   │   └── test/    # Test page
│   ├── budgets/     # Budget management
│   ├── settings/    # Application settings
│   └── transactions/# Transaction management
├── types/           # TypeScript type definitions
└── server/          # Server-side logic

supabase/
└── migrations/      # Database migrations
```

## Key Files

- `src/App.tsx`: Main application component and routing setup
- `src/main.tsx`: Application entry point
- `src/lib/supabase.ts`: Supabase client configuration
- `src/lib/auth.tsx`: Authentication logic and context
- `src/lib/import/parser.ts`: Transaction import parsing logic
- `src/types/transactions.ts`: Core transaction type definitions

## Component Organization

Components are organized by feature to maintain a scalable and maintainable codebase:

### Core Components
- `auth/`: Authentication forms and components
- `bank-accounts/`: Bank account management
  - `bank-accounts-table.tsx`: Account listing with edit/delete
  - `add-bank-account-dialog.tsx`: Account creation
  - `edit-bank-account-dialog.tsx`: Account editing
  - `delete-bank-account-dialog.tsx`: Account deletion with confirmation
- `layout/`: Application shell components (sidebar, navigation, assets-sidebar)
- `ui/`: Reusable UI components (buttons, inputs, separator, etc.)

### Feature Components
- `transactions/`: Transaction management
  - `import/`: Import flow components
  - `transaction-form/`: Transaction creation/editing
  - `columns-visibility/`: Column visibility preferences
- `expense-categories/`: Expense categorization
- `user-tags/`: Tag management system

## Custom Hooks

Custom hooks encapsulate reusable logic:
- `useBanks.ts`: Bank list management
- `useUserBankAccounts.ts`: Bank account operations (add/edit/delete)
- `useTransactions.ts`: Transaction operations
- `useExpenseCategories.ts`: Category management
- `useImport.ts`: Import flow logic
- `useTags.ts`: Tagging system
- `useColumnPreferences.ts`: Column visibility preferences

## Database Structure

The database schema is managed through Supabase migrations in the `supabase/migrations/` directory. Key tables include:
- User Bank Accounts
- Banks
- Transactions
- Expense Categories
- User Tags
- Import Mappings
- Transaction Rules
- Budgets
- Column Preferences (columns_transactions)

## Build Configuration

- `vite.config.ts`: Vite build configuration
- `tsconfig.json`: TypeScript configuration
- `tailwind.config.js`: Tailwind CSS configuration
- `postcss.config.js`: PostCSS configuration
