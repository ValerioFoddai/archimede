import { Control, useWatch, useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useExpenseCategories } from '@/hooks/useExpenseCategories';
import type { TransactionFormData } from '@/types/transactions';

interface CategorySelectProps {
  control: Control<TransactionFormData>;
}

export function CategorySelect({ control }: CategorySelectProps) {
  const { categories, loading } = useExpenseCategories();
  const { setValue } = useFormContext<TransactionFormData>();
  const mainCategoryId = useWatch({
    control,
    name: "mainCategoryId",
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField
        control={control}
        name="mainCategoryId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Main Category</FormLabel>
            <Select
              disabled={loading}
              onValueChange={(value) => {
                field.onChange(Number(value));
                // Reset sub-category when main category changes
                setValue('subCategoryId', undefined);
              }}
              value={field.value?.toString()}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id.toString()}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="subCategoryId"
        render={({ field }) => {
          const mainCategory = categories.find(
            (c) => c.id === mainCategoryId
          );

          return (
            <FormItem>
              <FormLabel>Sub Category</FormLabel>
              <Select
                disabled={!mainCategory}
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {mainCategory?.sub_categories.map((sub) => (
                    <SelectItem
                      key={sub.id}
                      value={sub.id.toString()}
                    >
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
}