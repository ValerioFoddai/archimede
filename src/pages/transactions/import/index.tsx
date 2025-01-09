import { useState, useCallback } from 'react';
import { read, utils } from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import { DashboardLayout } from '../../../components/layout/dashboard-layout';
import { FileUpload } from '../../../components/transactions/import/file-upload';
import { Button } from '../../../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { ImportPreview } from '../../../components/transactions/import/import-preview';
import { ImportSummary } from '../../../components/transactions/import/import-summary';
import { useImport } from '../../../hooks/useImport';
import type { TransactionImport } from '../../../types/import';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const DATE_FORMATS = [
  { value: "dd/MM/yyyy", label: "DD/MM/YYYY" },
  { value: "MM/dd/yyyy", label: "MM/DD/YYYY" },
  { value: "yyyy-MM-dd", label: "YYYY-MM-DD" },
  { value: "dd-MM-yyyy", label: "DD-MM-YYYY" },
  { value: "dd.MM.yyyy", label: "DD.MM.YYYY" },
  { value: "yyyy.MM.dd", label: "YYYY.MM.DD" },
];

const TARGET_FIELDS = [
  { id: "date", label: "Date", description: "Transaction date" },
  { id: "merchant", label: "Merchant", description: "Name of the merchant" },
  { id: "amount", label: "Amount", description: "Transaction amount" },
  { id: "notes", label: "Notes", description: "Additional transaction details" },
];

const SKIP_COLUMN = "_skip";

interface ColumnMapping {
  id: string;
  sourceColumn: string;
  targetField: string;
}

export function ImportPage() {
  const [fileColumns, setFileColumns] = useState<string[]>([]);
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [dateFormat, setDateFormat] = useState("dd/MM/yyyy");
  const [transactions, setTransactions] = useState<TransactionImport[]>([]);
  const [importComplete, setImportComplete] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const { processFile, importTransactions, loading, error: importError } = useImport();

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
      const initialMappings = columns.map(column => ({
        id: uuidv4(),
        sourceColumn: column,
        targetField: guessTargetField(column)
      }));
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
        if (targetField && targetField !== SKIP_COLUMN) {
          acc[targetField] = sourceColumn;
        }
        return acc;
      }, {} as Record<string, string>),
      dateFormat,
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

        {(importError || fileError) && (
          <Alert variant="destructive">
            <AlertDescription>
              {fileError || importError}
            </AlertDescription>
          </Alert>
        )}

        {!fileColumns.length && (
          <FileUpload
            onUpload={handleFileUpload}
            loading={loading}
            selectedFile={uploadedFile}
          />
        )}

        {fileColumns.length > 0 && !transactions.length && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Map Columns</CardTitle>
                <CardDescription>
                  Match the columns from your file to the corresponding transaction fields
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">File Column</TableHead>
                        <TableHead>Maps To</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {columnMappings.map(({ id, sourceColumn, targetField }) => (
                        <TableRow key={id}>
                          <TableCell className="font-medium">
                            {sourceColumn}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={targetField}
                              onValueChange={(value: string) =>
                                handleMappingChange(sourceColumn, value)
                              }
                            >
                              <SelectTrigger className="w-[300px]">
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={SKIP_COLUMN}>
                                  <div className="space-y-1">
                                    <div>Skip this column</div>
                                    <p className="text-xs text-muted-foreground">
                                      Don't import this column
                                    </p>
                                  </div>
                                </SelectItem>
                                {TARGET_FIELDS.map((field) => (
                                  <SelectItem key={field.id} value={field.id}>
                                    <div className="space-y-1">
                                      <div>{field.label}</div>
                                      <p className="text-xs text-muted-foreground">
                                        {field.description}
                                      </p>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Date Format</CardTitle>
                    <CardDescription>
                      Select the format that matches your file's date format
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Select value={dateFormat} onValueChange={setDateFormat}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        {DATE_FORMATS.map((format) => (
                          <SelectItem key={format.value} value={format.value}>
                            {format.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFileColumns([]);
                        setColumnMappings([]);
                        setUploadedFile(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handlePreview} disabled={loading}>
                      Preview Import
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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

// Helper function to guess target field based on column name
function guessTargetField(columnName: string): string {
  const normalized = columnName.toLowerCase();
  
  if (normalized.includes('date') || normalized.includes('data')) return 'date';
  if (normalized.includes('merchant') || normalized.includes('nome')) return 'merchant';
  if (normalized.includes('amount') || normalized.includes('importo')) return 'amount';
  if (normalized.includes('note') || normalized.includes('description')) return 'notes';
  
  return SKIP_COLUMN;
}

// Helper function to get file columns
async function getFileColumns(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    if (file.name.toLowerCase().endsWith('.xlsx')) {
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const headers = utils.sheet_to_json<string[]>(firstSheet, { 
            header: 1,
            raw: false,
            defval: '',
            range: 0
          })[0];
          
          if (!headers || headers.length === 0) {
            throw new Error('No headers found in file');
          }
          
          resolve(headers);
        } catch (error) {
          reject(error instanceof Error ? error : new Error('Failed to read file headers'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    } else {
      // For CSV files
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const firstLine = content.split('\n')[0];
          const columns = firstLine.split(',').map(col => col.trim().replace(/^["']|["']$/g, ''));
          if (!columns || columns.length === 0) {
            throw new Error('No headers found in file');
          }
          resolve(columns);
        } catch (error) {
          reject(error instanceof Error ? error : new Error('Failed to read file headers'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    }
  });
}