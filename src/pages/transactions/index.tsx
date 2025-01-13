import { useState } from 'react';
import { Bot, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { TransactionList } from '@/components/transactions/transaction-list';
import { TransactionHeader } from '@/components/transactions/transaction-header';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { useTransactionRules } from '@/hooks/useTransactionRules';
import type { Transaction, TransactionFormData, ColumnVisibility } from '@/types/transactions';

export function TransactionsPage() {
  const [timeRange, setTimeRange] = useState<string>('7d');
  const { transactions, loading, createTransaction, updateTransaction, deleteTransaction, applyTransactionRules } = useTransactions(timeRange);
  const { rules } = useTransactionRules();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isApplyingRules, setIsApplyingRules] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [isAutoRulesDialogOpen, setIsAutoRulesDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    bank: false,
    category: true,
    tags: true,
    notes: true,
  });

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

  const handleBulkDeleteConfirm = async () => {
    try {
      await Promise.all(selectedIds.map(id => deleteTransaction(id)));
      setSelectedIds([]);
      setIsBulkDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting transactions:', error);
    }
  };

  const handleSelectTransaction = (id: string, checked: boolean) => {
    setSelectedIds(prev => 
      checked ? [...prev, id] : prev.filter(selectedId => selectedId !== id)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? transactions.map(t => t.id) : []);
  };

  const handleColumnVisibilityChange = (visibility: Partial<ColumnVisibility>) => {
    setColumnVisibility(prev => ({ ...prev, ...visibility }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <TransactionHeader
          onAddTransaction={() => setIsFormOpen(true)}
          onApplyRules={() => setIsAutoRulesDialogOpen(true)}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={handleColumnVisibilityChange}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />
        
        <TransactionList
          transactions={transactions}
          loading={loading}
          selectedIds={selectedIds}
          columnVisibility={columnVisibility}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSelectTransaction={handleSelectTransaction}
          onSelectAll={handleSelectAll}
          onBulkDelete={() => setIsBulkDeleteDialogOpen(true)}
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

        <AlertDialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Selected Transactions</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {selectedIds.length} selected transaction{selectedIds.length === 1 ? '' : 's'}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsBulkDeleteDialogOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleBulkDeleteConfirm}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={isAutoRulesDialogOpen} onOpenChange={setIsAutoRulesDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Apply Transaction Rules</AlertDialogTitle>
              <AlertDialogDescription>
                {rules.length === 0 ? (
                  <>
                    No transaction rules found. Please create rules in the{' '}
                    <Link to="/settings/transaction-rules" className="text-primary hover:underline" onClick={() => setIsAutoRulesDialogOpen(false)}>
                      Transaction Rules
                    </Link>{' '}
                    section before using this feature.
                  </>
                ) : (
                  'This will automatically categorize your transactions based on the rules you\'ve created. Would you like to proceed?'
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsAutoRulesDialogOpen(false)}>
                Cancel
              </AlertDialogCancel>
              {rules.length > 0 && (
                <AlertDialogAction 
                  onClick={async () => {
                    setIsApplyingRules(true);
                    try {
                      await applyTransactionRules();
                      setIsAutoRulesDialogOpen(false);
                    } finally {
                      setIsApplyingRules(false);
                    }
                  }}
                  disabled={isApplyingRules}
                >
                  {isApplyingRules ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Applying Rules...
                    </>
                  ) : (
                    'Apply Rules'
                  )}
                </AlertDialogAction>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </DashboardLayout>
  );
}
