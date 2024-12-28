import { useState } from 'react';
import { CategoryHeader } from '@/components/expense-categories/category-header';
import { CategoryTable } from '@/components/expense-categories/category-table';
import { useExpenseCategories } from '@/hooks/useExpenseCategories';
import type { MainCategory } from '@/types/expense-categories';

export function ExpenseCategoriesPage() {
  const { categories, loading, error } = useExpenseCategories();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCategory = () => {
    // TODO: Implement add category functionality
    console.log('Add category clicked');
  };

  const handleEditCategory = (category: MainCategory) => {
    // TODO: Implement edit category functionality
    console.log('Edit category:', category);
  };

  const handleDeleteCategory = (category: MainCategory) => {
    // TODO: Implement delete category functionality
    console.log('Delete category:', category);
  };

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
      <CategoryHeader
        onAddCategory={handleAddCategory}
        onSearch={setSearchQuery}
      />
      <CategoryTable
        categories={filteredCategories}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
      />
    </div>
  );
}