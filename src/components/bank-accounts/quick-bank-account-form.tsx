import { useForm } from "react-hook-form";
import { useUserBankAccounts } from "@/hooks/useUserBankAccounts";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface QuickBankAccountFormData {
  account_name: string;
  balance: string;
}

interface QuickBankAccountFormProps {
  bankId: string;
  bankName: string;
  onAccountCreated: (accountId: number) => void;
  onCancel: () => void;
}

export function QuickBankAccountForm({
  bankId,
  bankName,
  onAccountCreated,
  onCancel,
}: QuickBankAccountFormProps) {
  const { addAccount } = useUserBankAccounts();
  const { toast } = useToast();
  const form = useForm<QuickBankAccountFormData>({
    defaultValues: {
      balance: "0",
    },
  });

  const onSubmit = async (data: QuickBankAccountFormData) => {
    try {
      const balance = parseFloat(data.balance);
      if (isNaN(balance)) {
        throw new Error("Invalid balance amount");
      }

      const newAccount = await addAccount({
        bank_id: bankId,
        account_name: data.account_name,
        balance: balance,
      });

      if (newAccount) {
        onAccountCreated(newAccount.id);
        form.reset();
        toast({
          title: "Success",
          description: "Bank account created successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create bank account",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          Creating a new account for {bankName}
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="account_name"
            rules={{ required: "Account name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={`e.g. ${bankName} Checking`} 
                    {...field} 
                    autoFocus
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="balance"
            rules={{ required: "Initial balance is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Initial Balance</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button type="submit">Create Account</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
