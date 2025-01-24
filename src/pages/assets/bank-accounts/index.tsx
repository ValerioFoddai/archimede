import { Card } from "@/components/ui/card";
import { useUserBankAccounts } from "@/hooks/useUserBankAccounts";
import { BankAccountsTable } from "@/components/bank-accounts/bank-accounts-table";
import { AddBankAccountDialog } from "@/components/bank-accounts/add-bank-account-dialog";

export default function BankAccountsPage() {
  const { accounts, loading, error, refresh, updateAccount, deleteAccount } = useUserBankAccounts();

  console.log('Bank Accounts Page - accounts:', accounts);
  console.log('Bank Accounts Page - loading:', loading);
  console.log('Bank Accounts Page - error:', error);

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
          <BankAccountsTable 
            accounts={accounts}
            onUpdate={updateAccount}
            onDelete={deleteAccount}
            onAccountModified={refresh}
          />
        )}
      </Card>
    </div>
  );
}
