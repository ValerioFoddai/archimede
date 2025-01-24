import { useState } from "react";
import { useForm } from "react-hook-form";
import { useBanks } from "@/hooks/useBanks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useUserBankAccounts } from "@/hooks/useUserBankAccounts";

interface AddBankAccountFormData {
  bank_id: string;
  account_name: string;
  balance: string;
  description?: string;
}

interface AddBankAccountDialogProps {
  onAccountAdded: () => void;
}

export function AddBankAccountDialog({ onAccountAdded }: AddBankAccountDialogProps) {
  const [open, setOpen] = useState(false);
  const { banks } = useBanks();
  const { addAccount } = useUserBankAccounts();
  const { toast } = useToast();
  const form = useForm<AddBankAccountFormData>({
    defaultValues: {
      bank_id: "",
      account_name: "",
      balance: "0",
      description: "",
    },
  });

  const onSubmit = async (data: AddBankAccountFormData) => {
    try {
      const balance = parseFloat(data.balance);
      if (isNaN(balance)) {
        throw new Error("Invalid balance amount");
      }

      console.log('Submitting bank account with data:', {
        bank_id: data.bank_id,
        account_name: data.account_name,
        balance: balance,
        description: data.description,
      });

      await addAccount({
        bank_id: data.bank_id,
        account_name: data.account_name,
        balance: balance,
        description: data.description,
      });
      await onAccountAdded();
      setOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Bank account added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add bank account",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Account</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Bank Account</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="bank_id"
              rules={{ required: "Bank is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a bank" />
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
            <FormField
              control={form.control}
              name="account_name"
              rules={{ required: "Account name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Main Checking" {...field} />
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
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add a description for this account"
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
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Account</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
