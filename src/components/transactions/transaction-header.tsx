import { Plus, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
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
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link to="/transactions/import">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Link>
        </Button>
        <Button onClick={onAddTransaction}>
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>
    </div>
  );
}