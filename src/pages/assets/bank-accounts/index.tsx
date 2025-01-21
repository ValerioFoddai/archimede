import { Card } from "@/components/ui/card";
import { useUserBankAccounts } from "@/hooks/useUserBankAccounts";
import { BankAccountsTable } from "@/components/bank-accounts/bank-accounts-table";
import { AddBankAccountDialog } from "@/components/bank-accounts/add-bank-account-dialog";

export default function BankAccountsPage() {
  const { accounts, loading, error, refresh } = useUserBankAccounts();

  if (error) {
    return (
      <div className="space-y-6">
      <Card className="p-4">
          <div className="text-sm text-destructive">
            Error loading accounts: {error.message}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">Bank Accounts</h2>
        <AddBankAccountDialog onAccountAdded={refresh} />
      </div>
      <Card>
        {loading ? (
          <div className="p-4 text-sm text-muted-foreground">Loading accounts...</div>
        ) : (
          <BankAccountsTable accounts={accounts} />
        )}
      </Card>
    </div>
  );
}
