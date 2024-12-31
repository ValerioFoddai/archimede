import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { TransactionHeader } from '@/components/transactions/transaction-header';
import { TransactionList } from '@/components/transactions/transaction-list';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { TransactionForm } from '@/components/transactions/transaction-form';
import { useTransactions } from '@/hooks/useTransactions';
import type { TransactionFormData } from '@/types/transactions';

export function TransactionsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { transactions, loading, createTransaction } = useTransactions();

  const handleSubmit = async (data: TransactionFormData) => {
    try {
      const transaction = await createTransaction(data);
      if (transaction) {
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <TransactionHeader onAddTransaction={() => setIsAddDialogOpen(true)} />
        
        <TransactionList transactions={transactions} loading={loading} />

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <TransactionForm
              onSubmit={handleSubmit}
              onCancel={() => setIsAddDialogOpen(false)}
              isSubmitting={loading}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}