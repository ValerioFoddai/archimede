import { useState } from 'react';
import { CategoryHeader } from '../../components/expense-categories/category-header';
import { CategoryAccordion } from '../../components/expense-categories/category-accordion';
import { useExpenseCategories } from '../../hooks/useExpenseCategories';

export function ExpenseCategoriesPage() {
  const { categories, loading, error } = useExpenseCategories();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.sub_categories.some(sub => 
      sub.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[450px]">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[450px]">
        <div className="text-destructive">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CategoryHeader onSearch={setSearchQuery} />
      <CategoryAccordion categories={filteredCategories} />
    </div>
  );
}
