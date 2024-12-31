import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BankSelect } from './bank-select';
import { DateInput } from './date-input';
import { MerchantInput } from './merchant-input';
import { AmountInput } from './amount-input';
import { CategorySelect } from './category-select';
import { TagSelect } from './tag-select';
import { NotesInput } from './notes-input';
import { transactionSchema, type TransactionFormData } from '@/types/transactions';

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function TransactionForm({ onSubmit, onCancel, isSubmitting }: TransactionFormProps) {
  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: new Date(),
      merchant: '',
      amount: '',
      notes: '',
      tagIds: [],
    },
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add Transaction</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <BankSelect control={form.control} />
            <DateInput control={form.control} />
          </div>

          <MerchantInput control={form.control} />
          <AmountInput control={form.control} />
          
          <div className="space-y-4">
            <CategorySelect control={form.control} />
            <TagSelect control={form.control} />
          </div>

          <NotesInput control={form.control} />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Transaction'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}