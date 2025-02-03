import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { FileUpload } from '@/components/transactions/import/file-upload';
import { Button } from '@/components/ui/button';
import { ImportPreview } from '@/components/transactions/import/import-preview';
import { ImportSummary } from '@/components/transactions/import/import-summary';
import { useImport } from '@/hooks/useImport';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { revolutBankConfig } from '@/lib/import/banks/revolut';
import { useBanks } from '@/hooks/useBanks';
import type { TransactionImport, ImportConfig } from '@/types/import';

export function RevolutImportPage() {
  const [transactions, setTransactions] = useState<TransactionImport[]>([]);
  const [importComplete, setImportComplete] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [revolutBankId, setRevolutBankId] = useState<string | null>(null);
  
  const { banks, loading: loadingBanks } = useBanks();
  const { processFile, importTransactions, loading: importLoading, error: importError } = useImport();

  useEffect(() => {
    // Find Revolut bank ID
    const revolutBank = banks.find(bank => bank.name === 'Revolut');
    if (revolutBank?.id) {
      setRevolutBankId(revolutBank.id);
    }
  }, [banks]);

  const loading = importLoading || loadingBanks;

  const handleFileUpload = async (file: File) => {
    try {
      setFileError(null);
      setUploadedFile(file);
      setTransactions([]);
      setImportComplete(false);

      if (!revolutBankId) {
        throw new Error('Revolut configuration not found');
      }

      // Use the predefined Revolut bank configuration
      const mappingConfig: ImportConfig = {
        columnMappings: revolutBankConfig.columnMappings,
        dateFormat: revolutBankConfig.dateFormat!, // We know it's defined in the config
        bankId: revolutBankId, // Safe to use here since we've checked it's not null
      };

      const result = await processFile(file, mappingConfig);
      setTransactions(result);
    } catch (err) {
      console.error('Error uploading file:', err);
      setFileError(err instanceof Error ? err.message : 'Failed to process file');
      setUploadedFile(null);
    }
  };

  const handleImport = async () => {
    await importTransactions(transactions);
    setImportComplete(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Import Revolut Transactions</h2>
          <p className="text-muted-foreground">
            Import transactions directly from your Revolut CSV export
          </p>
        </div>

        {(importError || fileError) && (
          <Alert variant="destructive">
            <AlertDescription>
              {fileError || importError}
            </AlertDescription>
          </Alert>
        )}

        {!transactions.length && !importComplete && (
          <>
            <FileUpload
              onUpload={handleFileUpload}
              loading={loading}
              selectedFile={uploadedFile}
              acceptedFormats={['csv']}
            />
            <div className="flex justify-end">
              <Button variant="outline" asChild>
                <Link to="/transactions/import">Back</Link>
              </Button>
            </div>
          </>
        )}

        {transactions.length > 0 && !importComplete && (
          <>
            <ImportPreview transactions={transactions.slice(0, 5)} />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setTransactions([]);
                  setUploadedFile(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleImport} disabled={loading}>
                Import Transactions
              </Button>
            </div>
          </>
        )}

        {importComplete && (
          <ImportSummary transactions={transactions} />
        )}
      </div>
    </DashboardLayout>
  );
}
