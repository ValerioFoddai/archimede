import { MainCategory } from '../../types/expense-categories';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

interface CategoryAccordionProps {
  categories: MainCategory[];
}

export function CategoryAccordion({ categories }: CategoryAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full rounded-md border">
      {categories.map((category) => (
        <AccordionItem key={category.id} value={category.id.toString()}>
          <AccordionTrigger className="hover:no-underline px-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">{category.name}</span>
              <span className="text-sm text-muted-foreground">
                ({category.sub_categories.length} subcategories)
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 px-4">
              {category.description && (
                <p className="text-sm text-muted-foreground mb-4">
                  {category.description}
                </p>
              )}
              {category.sub_categories.map((subCategory) => (
                <div
                  key={subCategory.id}
                  className="flex items-center justify-between py-3 px-4 rounded-md bg-secondary/50 hover:bg-secondary/70 transition-colors"
                >
                  <span>{subCategory.name}</span>
                  {subCategory.description && (
                    <span className="text-sm text-muted-foreground">
                      {subCategory.description}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
