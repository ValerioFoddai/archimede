import { useState } from 'react';
import { Plus } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { TransactionHeader } from '@/components/transactions/transaction-header';
import { TransactionList } from '@/components/transactions/transaction-list';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { TransactionForm } from '@/components/transactions/transaction-form';
import { useTransactions } from '@/hooks/useTransactions';
import type { Transaction, TransactionFormData } from '@/types/transactions';

export function TransactionsPage() {
  const { transactions, loading, createTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDelete = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data: TransactionFormData) => {
    try {
      if (selectedTransaction) {
        await updateTransaction(selectedTransaction.id, data);
      } else {
        await createTransaction(data);
      }
      setIsFormOpen(false);
      setSelectedTransaction(null);
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (transactionToDelete) {
      await deleteTransaction(transactionToDelete.id);
      setIsDeleteDialogOpen(false);
      setTransactionToDelete(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <TransactionHeader onAddTransaction={() => setIsFormOpen(true)} />
        
        <TransactionList
          transactions={transactions}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Dialog
          open={isFormOpen}
          onOpenChange={(open) => {
            setIsFormOpen(open);
            if (!open) setSelectedTransaction(null);
          }}
        >
          <DialogContent className="sm:max-w-[600px]">
            <TransactionForm
              transaction={selectedTransaction}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setSelectedTransaction(null);
              }}
              isSubmitting={loading}
            />
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this transaction? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}