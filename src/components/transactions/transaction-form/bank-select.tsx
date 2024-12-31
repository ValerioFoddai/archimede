import { Control } from 'react-hook-form';
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
import { useBanks } from '@/hooks/useBanks';
import type { TransactionFormData } from '@/types/transactions';

interface BankSelectProps {
  control: Control<TransactionFormData>;
}

export function BankSelect({ control }: BankSelectProps) {
  const { banks, loading } = useBanks();

  return (
    <FormField
      control={control}
      name="bankId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Bank*</FormLabel>
          <Select
            disabled={loading}
            onValueChange={field.onChange}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select bank" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {banks.map((bank) => (
                <SelectItem key={bank.id} value={bank.id}>
                  {bank.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}