import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CategoryHeaderProps {
  onAddCategory: () => void;
  onSearch: (query: string) => void;
}

export function CategoryHeader({ onAddCategory, onSearch }: CategoryHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Expense Categories</h2>
        <p className="text-muted-foreground">
          Manage your expense categories and subcategories
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="w-full sm:w-[300px]">
          <Input
            placeholder="Search categories..."
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Button onClick={onAddCategory}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>
    </div>
  );
}