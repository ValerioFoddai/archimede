import React from "react";
import { useImportBankAccounts } from "@/hooks/useImportBankAccounts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface BankAccountSelectionProps {
  bankId?: string;
  onAccountSelect: (accountId: number | null) => void;
  onCreateNew: () => void;
}

export function BankAccountSelection({
  bankId,
  onAccountSelect,
  onCreateNew,
}: BankAccountSelectionProps) {
  const {
    hasExistingAccounts,
    selectedAccountId,
    relevantAccounts,
    loading,
    error,
    selectAccount,
    getSelectedBankName,
  } = useImportBankAccounts(bankId);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load bank accounts. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  const bankName = getSelectedBankName();

  const handleSelectChange = (value: string) => {
    const accountId = value ? parseInt(value) : null;
    selectAccount(accountId);
    onAccountSelect(accountId);
  };

  return (
    <div className="space-y-4">
      {!hasExistingAccounts ? (
        <div className="space-y-4">
          <Alert>
            <AlertDescription>
              {bankName
                ? `You don't have any accounts set up for ${bankName} yet.`
                : "You don't have any bank accounts set up yet."}
            </AlertDescription>
          </Alert>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => onAccountSelect(null)}>
              Continue without account
            </Button>
            <Button onClick={onCreateNew}>Create new account</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Select
            value={selectedAccountId?.toString() || ""}
            onValueChange={handleSelectChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a bank account" />
            </SelectTrigger>
            <SelectContent>
              {relevantAccounts.map((account) => (
                <SelectItem key={account.id} value={account.id.toString()}>
                  {account.account_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => {
                selectAccount(null);
                onAccountSelect(null);
              }}
            >
              Skip account selection
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <Button variant="secondary" onClick={onCreateNew}>
              Create new account
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
