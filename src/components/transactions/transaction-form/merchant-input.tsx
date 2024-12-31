import { Control } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { TransactionFormData } from '@/types/transactions';

interface MerchantInputProps {
  control: Control<TransactionFormData>;
}

export function MerchantInput({ control }: MerchantInputProps) {
  return (
    <FormField
      control={control}
      name="merchant"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Merchant*</FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder="Enter merchant name"
              autoComplete="off"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}