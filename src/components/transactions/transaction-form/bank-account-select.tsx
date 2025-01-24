import { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUserBankAccounts } from '@/hooks/useUserBankAccounts';
import type { TransactionFormData } from '@/types/transactions';

interface BankAccountSelectProps {
  control: Control<TransactionFormData>;
}

export function BankAccountSelect({ control }: BankAccountSelectProps) {
  const { accounts, loading } = useUserBankAccounts();

  // Only show bank account select if there are accounts
  if (accounts.length === 0) {
    return null;
  }

  return (
    <FormField
      control={control}
      name="bankAccountId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Bank Account (Optional)</FormLabel>
          <Select
            onValueChange={(value) => field.onChange(value)}
            value={field.value === null ? undefined : field.value?.toString()}
            disabled={loading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select bank account" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id.toString()}>
                  {account.account_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}
