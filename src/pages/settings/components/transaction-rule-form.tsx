import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../../../components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { TransactionRuleFormData } from "../../../types/transaction-rules";
import { RuleCategorySelect } from "./rule-category-select";

const formSchema = z.object({
  keywords: z.string().min(1, "Keywords are required"),
  main_category: z.string().min(1, "Main category is required"),
  sub_category: z.string().min(1, "Sub category is required"),
});

interface TransactionRuleFormProps {
  defaultValues?: TransactionRuleFormData;
  onSubmit: (data: TransactionRuleFormData) => void;
  onCancel: () => void;
}

export function TransactionRuleForm({ defaultValues, onSubmit, onCancel }: TransactionRuleFormProps) {
  const form = useForm<TransactionRuleFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      keywords: "",
      main_category: "",
      sub_category: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keywords</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter merchant name keywords" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Category</FormLabel>
          <RuleCategorySelect />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
