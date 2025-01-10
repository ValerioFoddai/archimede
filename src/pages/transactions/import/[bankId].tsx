import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ImportPreview } from '@/components/transactions/import/import-preview';
import { ImportSummary } from '@/components/transactions/import/import-summary';
import { FileUpload } from '@/components/transactions/import/file-upload';
import { useBanks } from '@/hooks/useBanks';
import { useImport } from '@/hooks/useImport';
import type { TransactionImport } from '@/types/import';

export function ImportBankPage() {
  const { bankId } = useParams();
  const navigate = useNavigate();
  const { banks } = useBanks();
  const { processFile, importTransactions, loading, error } = useImport();
  const [transactions, setTransactions] = useState<TransactionImport[]>([]);
  const [importComplete, setImportComplete] = useState(false);

  const bank = banks.find(b => b.id === bankId);

  if (!bank) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertDescription>Invalid bank selected</AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  const handleFileUpload = async (file: File) => {
    const config = {
      columnMappings: {
        date: 'Data operazione',
        description: 'Descrizione',
        amount: 'Importo'
      },
      dateFormat: 'DD/MM/YYYY'
    };
    const result = await processFile(file, config);
    setTransactions(result);
  };

  const handleImport = async () => {
    await importTransactions(transactions);
    setImportComplete(true);
  };

  const handleFinish = () => {
    navigate('/transactions');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Import {bank.name} Transactions
          </h2>
          <p className="text-muted-foreground">
            Upload your transaction file to begin the import process
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!transactions.length && !importComplete && (
          <FileUpload
            onUpload={handleFileUpload}
            loading={loading}
          />
        )}

        {transactions.length > 0 && !importComplete && (
          <>
            <ImportPreview transactions={transactions.slice(0, 5)} />
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setTransactions([])}
              >
                Cancel
              </Button>
              <Button onClick={handleImport} disabled={loading}>
                <Upload className="mr-2 h-4 w-4" />
                Import Transactions
              </Button>
            </div>
          </>
        )}

        {importComplete && (
          <>
            <ImportSummary transactions={transactions} />
            <div className="flex justify-end">
              <Button onClick={handleFinish}>
                View Transactions
              </Button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
