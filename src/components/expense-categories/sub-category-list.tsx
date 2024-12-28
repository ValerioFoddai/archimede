import type { SubCategory } from '@/types/expense-categories';

interface SubCategoryListProps {
  subCategories: SubCategory[];
}

export function SubCategoryList({ subCategories }: SubCategoryListProps) {
  return (
    <div className="grid gap-2">
      {subCategories.map((subCategory) => (
        <div
          key={subCategory.id}
          className="flex items-center px-2 py-1 rounded-md hover:bg-accent"
        >
          {subCategory.name}
        </div>
      ))}
    </div>
  );
}