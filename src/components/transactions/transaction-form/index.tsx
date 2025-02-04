import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DateInput } from './date-input';
import { MerchantInput } from './merchant-input';
import { AmountInput } from './amount-input';
import { CategorySelect } from './category-select';
import { TagSelect } from './tag-select';
import { NotesInput } from './notes-input';
import { transactionSchema, type TransactionFormData, type Transaction } from '@/types/transactions';

interface TransactionFormProps {
  transaction?: Transaction | null;
  onSubmit: (data: TransactionFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function TransactionForm({ transaction, onSubmit, onCancel, isSubmitting }: TransactionFormProps) {
  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: transaction?.date || new Date(),
      merchant: transaction?.merchant || '',
      amount: transaction?.amount ? transaction.amount.toString() : '',
      mainCategoryId: transaction?.mainCategoryId,
      subCategoryId: transaction?.subCategoryId,
      tagIds: transaction?.tagIds || [],
      notes: transaction?.notes || '',
    },
  });

  // Reset form when transaction changes
  useEffect(() => {
    console.log('Transaction changed:', transaction);
    form.reset({
      date: transaction?.date || new Date(),
      merchant: transaction?.merchant || '',
      amount: transaction?.amount ? transaction.amount.toString() : '',
      mainCategoryId: transaction?.mainCategoryId,
      subCategoryId: transaction?.subCategoryId,
      tagIds: transaction?.tagIds || [],
      notes: transaction?.notes || '',
    });
  }, [transaction, form]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {transaction ? 'Edit Transaction' : 'Add Transaction'}
        </DialogTitle>
        <DialogDescription>
          {transaction ? 'Edit the details of your transaction.' : 'Enter the details of your new transaction.'}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <DateInput control={form.control} />
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
              {isSubmitting ? 'Saving...' : transaction ? 'Update Transaction' : 'Save Transaction'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
