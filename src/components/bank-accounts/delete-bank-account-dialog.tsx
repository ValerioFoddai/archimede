import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { UserBankAccount } from "@/hooks/useUserBankAccounts";

interface DeleteBankAccountDialogProps {
  account: UserBankAccount;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccountDeleted: () => void;
  onDelete: (id: number) => Promise<void>;
}

export function DeleteBankAccountDialog({ 
  account,
  open,
  onOpenChange,
  onAccountDeleted,
  onDelete,
}: DeleteBankAccountDialogProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(account.id);
      await onAccountDeleted();
      onOpenChange(false);
      toast({
        title: "Success",
        description: "Bank account deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete bank account",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Bank Account</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the account "{account.account_name}"? This will remove the bank account association from any linked transactions, but the transactions themselves will remain in the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:pointer-events-none"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
