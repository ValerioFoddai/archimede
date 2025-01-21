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

### Core Tables
- User Bank Accounts (user_bank_accounts)
  - Stores user's bank account information
  - Integer primary key
  - Links to banks table and user profiles
  - Includes account name, balance, and description

- Banks (banks)
  - Stores available banking institutions
  - Text primary key
  - Includes bank name and creation timestamp

- Transactions (user_transactions)
  - Stores user's financial transactions
  - UUID primary key
  - Links to categories, bank accounts, and user profiles
  - Includes date, merchant, amount, and notes

### Relationship Tables
- Transaction Bank Accounts (transaction_bank_accounts)
  - Maps transactions to bank accounts
  - UUID primary key
  - Links transactions (UUID) to bank accounts (Integer)
  - Enforces referential integrity with CASCADE/RESTRICT rules
  - Protected by Row Level Security for user data isolation

### Supporting Tables
- Expense Categories (main_expense_categories, sub_expense_categories)
- User Tags
- Transaction Rules
- Budgets
- Column Preferences (columns_transactions)

Each table implements Row Level Security (RLS) policies to ensure users can only access their own data. Foreign key constraints and indexes are used to maintain data integrity and query performance.

## Build Configuration

- `vite.config.ts`: Vite build configuration
- `tsconfig.json`: TypeScript configuration
- `tailwind.config.js`: Tailwind CSS configuration
- `postcss.config.js`: PostCSS configuration
