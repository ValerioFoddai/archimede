import { Input } from '../ui/input';

interface CategoryHeaderProps {
  onSearch: (query: string) => void;
}

export function CategoryHeader({ onSearch }: CategoryHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Expense Categories</h2>
        <p className="text-muted-foreground">
          View your expense categories and subcategories
        </p>
      </div>
      <div className="w-full sm:w-[300px]">
        <Input
          placeholder="Search categories..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
}
