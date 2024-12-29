import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { useBankTemplates } from '../../../hooks/useBankTemplates';
import type { CreateBankTemplateInput } from '../../../types/bank-templates';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  column_mappings: z.array(z.object({
    source_column: z.string().min(1, 'Source column is required'),
    target_column: z.enum(['date', 'description', 'amount', 'notes'], {
      required_error: 'Target column is required',
    }),
    transformation: z.string().optional(),
  })).min(1, 'At least one column mapping is required'),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateBankTemplateFormProps {
  onSuccess: () => void;
}

export function CreateBankTemplateForm({ onSuccess }: CreateBankTemplateFormProps) {
  const { createTemplate } = useBankTemplates();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      column_mappings: [
        { source_column: '', target_column: 'date' },
        { source_column: '', target_column: 'description' },
        { source_column: '', target_column: 'amount' },
      ],
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setSubmitting(true);
      await createTemplate(values as CreateBankTemplateInput);
      onSuccess();
    } catch (error) {
      // Error handling is done in createTemplate
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Hype Bank" {...field} />
              </FormControl>
              <FormDescription>
                A name to identify this bank template
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Optional description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Column Mappings</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const currentMappings = form.getValues('column_mappings');
                form.setValue('column_mappings', [
                  ...currentMappings,
                  { source_column: '', target_column: 'date' },
                ]);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Mapping
            </Button>
          </div>

          {form.watch('column_mappings').map((_, index) => (
            <div key={index} className="flex items-start gap-4">
              <FormField
                control={form.control}
                name={`column_mappings.${index}.source_column`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="CSV column name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`column_mappings.${index}.target_column`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="description">Description</SelectItem>
                        <SelectItem value="amount">Amount</SelectItem>
                        <SelectItem value="notes">Notes</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-2"
                onClick={() => {
                  const currentMappings = form.getValues('column_mappings');
                  if (currentMappings.length > 1) {
                    form.setValue(
                      'column_mappings',
                      currentMappings.filter((_, i) => i !== index)
                    );
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Template'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
