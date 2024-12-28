import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { MainCategory } from '@/types/expense-categories';
import { SubCategoryList } from './sub-category-list';

interface CategoryListProps {
  categories: MainCategory[];
}

export function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="border rounded-lg">
      <Accordion type="single" collapsible className="w-full">
        {categories.map((category) => (
          <AccordionItem key={category.id} value={category.id.toString()}>
            <AccordionTrigger className="px-4 hover:no-underline hover:bg-accent">
              {category.name}
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <SubCategoryList subCategories={category.sub_categories} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}