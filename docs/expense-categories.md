# Expense Categories & Subcategories

## Overview

Expense categories provide a hierarchical system for organizing and tracking transactions. The system supports two levels:
- Parent categories (e.g., "Transportation")
- Subcategories (e.g., "Fuel", "Public Transport", "Car Maintenance")

This structure enables:
- Detailed transaction categorization
- Budget tracking at both category and subcategory levels
- Hierarchical expense reporting
- Flexible organization of financial data

## Data Structure

### Database Schema
Located in `supabase/migrations/20250112000000_add_expense_categories.sql`

```sql
create table expense_categories (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade,
    name text not null,
    parent_id uuid references expense_categories(id) on delete cascade,
    description text,
    color text,
    icon text,
    sort_order integer,
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
);
```

### TypeScript Types
Located in `src/types/expense-categories.ts`

```typescript
interface ExpenseCategory {
    id: string;
    userId: string;
    name: string;
    parentId: string | null;
    description?: string;
    color?: string;
    icon?: string;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
}
```

## Usage in Transactions

### Category Selection
Component: `src/components/transactions/transaction-form/category-select.tsx`
- Hierarchical dropdown for category selection
- Quick category creation
- Recent categories suggestion
- Search functionality

### Category Assignment
- Each transaction must have a category
- Subcategory is optional
- Categories can be assigned:
  - Manually during transaction creation/edit
  - Automatically through import mappings
  - Via transaction rules

## UI and User Flow

### Category Management
Component: `src/components/expense-categories/category-list.tsx`

#### Category List View
```
Parent Category
├── Subcategory 1
├── Subcategory 2
└── Subcategory 3

Parent Category 2
├── Subcategory 1
└── Subcategory 2
```

### User Interactions
1. Category Creation
   - Name (required)
   - Description (optional)
   - Color selection
   - Icon selection
   - Sort order

2. Category Editing
   - Modify any category attributes
   - Reorder categories/subcategories
   - Move subcategories between parents

3. Category Deletion
   - Validation of usage in transactions
   - Option to reassign transactions
   - Cascade delete for subcategories

## Validation & Business Rules

### Category Rules
1. Names must be unique within the same level
2. Parent categories cannot be used directly in transactions
3. Maximum depth of 2 levels (parent → child)
4. Sort order must be unique per level
5. Color must be a valid hex code
6. Icons must be from the approved icon set

### Relationship Rules
1. Subcategories can only have one parent
2. Parent categories cannot become subcategories
3. Circular references are prevented
4. Orphaned subcategories are not allowed

## API and Database Operations

### Category Operations
Located in `src/hooks/useExpenseCategories.ts`

```typescript
const useExpenseCategories = () => {
  // Fetch all categories
  const fetchCategories = async () => {...}
  
  // Create category
  const createCategory = async (data: CategoryInput) => {...}
  
  // Update category
  const updateCategory = async (id: string, data: CategoryInput) => {...}
  
  // Delete category
  const deleteCategory = async (id: string) => {...}
  
  // Reorder categories
  const reorderCategories = async (updates: CategoryOrder[]) => {...}
};
```

### Database Queries

#### Fetch Categories
```sql
select 
    c.*,
    count(t.id) as transaction_count
from expense_categories c
left join transactions t on t.category_id = c.id
where c.user_id = :user_id
group by c.id
order by c.sort_order;
```

#### Category Usage
```sql
select 
    c.id,
    c.name,
    count(t.id) as usage_count,
    sum(t.amount) as total_amount
from expense_categories c
left join transactions t on t.category_id = c.id
where c.user_id = :user_id
group by c.id, c.name
order by usage_count desc;
```

## Performance Considerations

### Caching
- Categories are cached client-side
- Cache invalidation on updates
- Periodic refresh for multi-device sync

### Query Optimization
- Eager loading of subcategories
- Denormalized transaction counts
- Indexed category lookups

## Migration and Maintenance

### Adding New Categories
1. Create migration script
2. Update default categories
3. Run data validation
4. Update UI components

### Category System Updates
1. Backup existing categories
2. Apply schema changes
3. Migrate category data
4. Update application logic
5. Verify data integrity

## Future Considerations

### Planned Enhancements
- Custom category attributes
- Category templates
- Advanced categorization rules
- Machine learning categorization
- Category analytics and insights

### Integration Points
- Budgeting system
- Analytics reports
- Import mappings
- Transaction rules
- API endpoints
