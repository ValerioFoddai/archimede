import { Control } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { TransactionFormData } from '@/types/transactions';

interface NotesInputProps {
  control: Control<TransactionFormData>;
}

export function NotesInput({ control }: NotesInputProps) {
  return (
    <FormField
      control={control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Notes</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              placeholder="Add any additional details about this transaction"
              className="resize-none"
              maxLength={500}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}