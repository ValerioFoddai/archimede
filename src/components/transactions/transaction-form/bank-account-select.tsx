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

  return (
    <FormField
      control={control}
      name="bankAccount"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Bank Account</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value || ''}
            disabled={loading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select bank account" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.account_name}>
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
