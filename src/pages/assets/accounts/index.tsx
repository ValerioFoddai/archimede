import { Card } from "@/components/ui/card";

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
        <p className="text-muted-foreground">
          Manage your accounts and track their balances
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {/* Account content will go here */}
          <p className="text-sm text-muted-foreground">No accounts found. Add an account to get started.</p>
        </div>
      </Card>
    </div>
  );
}
