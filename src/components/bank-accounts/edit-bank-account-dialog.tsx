import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { UserBankAccount } from "@/hooks/useUserBankAccounts";

interface EditBankAccountFormData {
  account_name: string;
  balance: string;
  description?: string;
}

interface EditBankAccountDialogProps {
  account: UserBankAccount;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccountUpdated: () => void;
  onUpdate: (id: number, data: { account_name: string; balance: number; description?: string }) => Promise<void>;
}

export function EditBankAccountDialog({
  account,
  open,
  onOpenChange,
  onAccountUpdated,
  onUpdate,
}: EditBankAccountDialogProps) {
  const { toast } = useToast();
  const form = useForm<EditBankAccountFormData>({
    defaultValues: {
      account_name: account.account_name,
      balance: account.balance.toString(),
      description: account.description || "",
    },
  });

  const onSubmit = async (data: EditBankAccountFormData) => {
    try {
      const balance = parseFloat(data.balance);
      if (isNaN(balance)) {
        throw new Error("Invalid balance amount");
      }

      await onUpdate(account.id, {
        account_name: data.account_name,
        balance,
        description: data.description,
      });

      await onAccountUpdated();
      onOpenChange(false);
      toast({
        title: "Success",
        description: "Bank account updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update bank account",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Bank Account</DialogTitle>
        </DialogHeader>
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
                    <Input placeholder="e.g. Main Checking" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="balance"
              rules={{ required: "Balance is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Balance</FormLabel>
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
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
