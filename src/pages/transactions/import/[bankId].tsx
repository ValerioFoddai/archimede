import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Upload, Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ImportPreview } from '@/components/transactions/import/import-preview';
import { ImportSummary } from '@/components/transactions/import/import-summary';
import { FileUpload } from '@/components/transactions/import/file-upload';
import { MappingManager } from '@/components/transactions/import/mapping-manager';
import { ColumnMapping } from '@/components/transactions/import/column-mapping';
import { useBanks } from '@/hooks/useBanks';
import { useImport } from '@/hooks/useImport';
import { parse } from 'papaparse';
import type { TransactionImport, ImportMapping } from '@/types/import';

export function ImportBankPage() {
  const { bankId } = useParams();
  const { banks } = useBanks();
  const { processFile, importTransactions, loading: importLoading, error: importError } = useImport();
  const [transactions, setTransactions] = useState<TransactionImport[]>([]);
  const [importComplete, setImportComplete] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({});
  const [dateFormat, setDateFormat] = useState('dd/MM/yyyy');
  const [processing, setProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);

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

  useEffect(() => {
    if (selectedFile) {
      parse(selectedFile, {
        preview: 1,
        header: true,
        encoding: 'UTF-8',
        complete: (results) => {
          if (results.meta.fields) {
            setHeaders(results.meta.fields);
          }
        },
        error: (error) => {
          console.error('Error parsing CSV headers:', error);
          setProcessingError('Failed to read CSV headers');
        },
      });
    }
  }, [selectedFile]);

  const handleFileUpload = async (file: File) => {
    setSelectedFile(file);
    setTransactions([]);
    setProcessingError(null);
  };

  const handleProcessFile = async () => {
    if (!selectedFile) return;

    try {
      setProcessing(true);
      setProcessingError(null);

      const config = {
        columnMappings,
        dateFormat
      };

      const result = await processFile(selectedFile, config);
      setTransactions(result);
    } catch (err) {
      console.error('Error processing file:', err);
      setProcessingError(err instanceof Error ? err.message : 'Failed to process file');
      setTransactions([]);
    } finally {
      setProcessing(false);
    }
  };

  const handleLoadMapping = (mapping: ImportMapping) => {
    setColumnMappings(mapping.columnMappings);
    setDateFormat(mapping.dateFormat);
  };

  const handleImport = async () => {
    try {
      await importTransactions(transactions);
      setImportComplete(true);
    } catch (err) {
      console.error('Error importing transactions:', err);
      // Error is handled by useImport hook
    }
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

        {(importError || processingError) && (
          <Alert variant="destructive">
            <AlertDescription>{importError || processingError}</AlertDescription>
          </Alert>
        )}

        {!transactions.length && !importComplete && (
          <>
            <FileUpload
              onUpload={handleFileUpload}
              loading={importLoading}
              selectedFile={selectedFile}
            />

            {selectedFile && headers.length > 0 && (
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Map CSV Columns</h3>
                  <div className="space-y-8">
                    <ColumnMapping
                      headers={headers}
                      columnMappings={columnMappings}
                      onMappingChange={(field, value) => {
                        setColumnMappings(prev => ({
                          ...prev,
                          [field]: value
                        }));
                      }}
                    />

                    <MappingManager
                      columnMappings={columnMappings}
                      dateFormat={dateFormat}
                      onLoadMapping={handleLoadMapping}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={handleProcessFile} 
                    disabled={processing || importLoading || !columnMappings.date || !columnMappings.merchant || !columnMappings.amount}
                  >
                    {processing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Process File'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </>
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
              <Button onClick={handleImport} disabled={importLoading}>
                {importLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Import Transactions
                  </>
                )}
              </Button>
            </div>
          </>
        )}

        {importComplete && <ImportSummary transactions={transactions} />}
      </div>
    </DashboardLayout>
  );
}
