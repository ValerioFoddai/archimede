import { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { useUserBankAccounts, type UserBankAccount } from '@/hooks/useUserBankAccounts';
import { TransactionFormData } from '@/types/transactions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BankAccountSelectProps {
  control: Control<TransactionFormData>;
}

export function BankAccountSelect({ control }: BankAccountSelectProps) {
  const { accounts } = useUserBankAccounts();

  return (
    <FormField
      control={control}
      name="bankAccountId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Bank Account</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a bank account" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {accounts?.map((account: UserBankAccount) => (
                <SelectItem key={account.id} value={account.id.toString()}>
                  {account.bank.name} - {account.account_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}
