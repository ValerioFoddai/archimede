import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TransactionHeaderProps {
  onAddTransaction: () => void;
}

export function TransactionHeader({ onAddTransaction }: TransactionHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Transactions</h2>
        <p className="text-muted-foreground">
          View and manage your transactions
        </p>
      </div>
      <Button onClick={onAddTransaction}>
        <Plus className="mr-2 h-4 w-4" />
        Add Transaction
      </Button>
    </div>
  );
}