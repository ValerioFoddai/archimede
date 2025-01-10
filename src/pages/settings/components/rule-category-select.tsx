import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useExpenseCategories } from '@/hooks/useExpenseCategories';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { TransactionRuleFormData } from '@/types/transaction-rules';

export function RuleCategorySelect() {
  const { categories, loading } = useExpenseCategories();
  const form = useFormContext<TransactionRuleFormData>();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="main_category"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Select
                disabled={loading}
                onValueChange={(value) => {
                  field.onChange(value);
                  form.setValue("sub_category", "");
                }}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.name}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sub_category"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Select
                disabled={!form.watch("main_category")}
                onValueChange={field.onChange}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .find((c) => c.name === form.watch("main_category"))
                    ?.sub_categories.map((sub) => (
                      <SelectItem
                        key={sub.id}
                        value={sub.name}
                      >
                        {sub.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
