import { Control } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { formatInputAmount } from '@/lib/format';
import type { TransactionFormData } from '@/types/transactions';

interface AmountInputProps {
  control: Control<TransactionFormData>;
}

export function AmountInput({ control }: AmountInputProps) {
  return (
    <FormField
      control={control}
      name="amount"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Amount*</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                className="text-right pr-8"
                onChange={(e) => {
                  const formattedValue = formatInputAmount(e.target.value);
                  if (formattedValue !== null) {
                    field.onChange(formattedValue);
                  }
                }}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">€</span>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}