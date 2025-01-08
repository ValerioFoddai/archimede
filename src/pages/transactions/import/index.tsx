import { useState } from 'react';
import { DashboardLayout } from '../../../components/layout/dashboard-layout';
import { FileUpload } from '../../../components/transactions/import/file-upload';
import { Button } from '../../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { ImportPreview } from '../../../components/transactions/import/import-preview';
import { ImportSummary } from '../../../components/transactions/import/import-summary';
import { useImport } from '../../../hooks/useImport';
import type { TransactionImport } from '../../../types/import';

interface ColumnMapping {
  sourceColumn: string;
  targetField: string;
}

const TARGET_FIELDS = [
  { id: 'date', label: 'Date' },
  { id: 'merchant', label: 'Merchant' },
  { id: 'amount', label: 'Amount' },
  { id: 'notes', label: 'Notes' },
];

// Helper functions
function getFileColumns(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        if (file.name.endsWith('.csv')) {
          // For CSV, get first line and split by comma
          const firstLine = content.split('\n')[0];
          const columns = firstLine.split(',').map(col => col.trim());
          resolve(columns);
        } else {
          // For XLSX, use a library like xlsx to read headers
          // TODO: Implement XLSX support
          reject(new Error('XLSX support not implemented yet'));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

function guessTargetField(columnName: string): string {
  const normalized = columnName.toLowerCase();
  
  if (normalized.includes('date') || normalized.includes('data')) return 'date';
  if (normalized.includes('merchant') || normalized.includes('nome')) return 'merchant';
  if (normalized.includes('amount') || normalized.includes('importo')) return 'amount';
  if (normalized.includes('note') || normalized.includes('description')) return 'notes';
  
  return '';
}

export function ImportPage() {
  const [fileColumns, setFileColumns] = useState<string[]>([]);
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [transactions, setTransactions] = useState<TransactionImport[]>([]);
  const [importComplete, setImportComplete] = useState(false);
  const { processFile, importTransactions, loading, error } = useImport();

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    try {
      setFileError(null);
      setUploadedFile(file);
      // Reset state
      setFileColumns([]);
      setColumnMappings([]);
      setTransactions([]);
      setImportComplete(false);

      console.log('Reading file:', file.name);
      // Get columns from file
      const columns = await getFileColumns(file);
      console.log('Found columns:', columns);
      setFileColumns(columns);

      // Try to auto-map columns based on names
      const initialMappings = columns.map(column => {
        const guessed = guessTargetField(column);
        console.log('Guessed mapping:', column, '->', guessed);
        return {
          sourceColumn: column,
          targetField: guessed
        };
      });
      setColumnMappings(initialMappings);
    } catch (err) {
      console.error('Error uploading file:', err);
      setFileError(err instanceof Error ? err.message : 'Failed to read file');
      // Reset states on error
      setUploadedFile(null);
      setFileColumns([]);
      setColumnMappings([]);
    }
  };

  const handleMappingChange = (sourceColumn: string, targetField: string) => {
    setColumnMappings(prev => 
      prev.map(mapping => 
        mapping.sourceColumn === sourceColumn 
          ? { ...mapping, targetField } 
          : mapping
      )
    );
  };

  const handlePreview = async () => {
    if (!columnMappings.length || !uploadedFile) return;

    const mappingConfig = {
      columnMappings: columnMappings.reduce((acc, { sourceColumn, targetField }) => {
        if (targetField) acc[sourceColumn] = targetField;
        return acc;
      }, {} as Record<string, string>)
    };

    const result = await processFile(uploadedFile, mappingConfig);
    setTransactions(result);
  };

  const handleImport = async () => {
    await importTransactions(transactions);
    setImportComplete(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Import Transactions</h2>
          <p className="text-muted-foreground">
            Upload your transaction file and map the columns to import
          </p>
        </div>

        {(error || fileError) && (
          <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md">
            {fileError || error}
          </div>
        )}

        {!fileColumns.length && (
          <FileUpload
            onUpload={handleFileUpload}
            loading={loading}
            accept=".csv,.xlsx"
          />
        )}

        {fileColumns.length > 0 && !transactions.length && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Map Columns</h3>
            <div className="grid gap-4">
              {columnMappings.map(({ sourceColumn, targetField }) => (
                <div key={sourceColumn} className="flex items-center gap-4">
                  <div className="w-1/2">
                    <p className="text-sm font-medium">{sourceColumn}</p>
                  </div>
                  <div className="w-1/2">
                    <Select
                      value={targetField}
                      onValueChange={(value: string) => handleMappingChange(sourceColumn, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Skip this column</SelectItem>
                        {TARGET_FIELDS.map(field => (
                          <SelectItem key={field.id} value={field.id}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button onClick={handlePreview} disabled={loading}>
                Preview Import
              </Button>
            </div>
          </div>
        )}

        {transactions.length > 0 && !importComplete && (
          <>
            <ImportPreview transactions={transactions.slice(0, 5)} />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setTransactions([]);
                  setColumnMappings([]);
                  setFileColumns([]);
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
