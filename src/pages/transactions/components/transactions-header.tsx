import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CSVImportDialog } from './csv-import-dialog';
import { useState } from 'react';

export function TransactionsHeader() {
  const [showImportDialog, setShowImportDialog] = useState(false);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Transactions</h2>
        <p className="text-muted-foreground">
          Manage and track your financial transactions
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => setShowImportDialog(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Import CSV
        </Button>
      </div>
      <CSVImportDialog 
        open={showImportDialog} 
        onOpenChange={setShowImportDialog} 
      />
    </div>
  );
}