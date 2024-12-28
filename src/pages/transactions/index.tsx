import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { TransactionsHeader } from './components/transactions-header';
import { TransactionsTable } from './components/transactions-table';
import { useTransactions } from '@/hooks/useTransactions';

export function TransactionsPage() {
  const { transactions, loading, error } = useTransactions();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[450px]">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[450px]">
          <div className="text-destructive">{error}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <TransactionsHeader />
        <TransactionsTable transactions={transactions} />
      </div>
    </DashboardLayout>
  );
}