import { useState } from "react";
import { read, utils } from "xlsx";
import { DashboardLayout } from "../../../components/layout/dashboard-layout";
import { FileUpload } from "../../../components/transactions/import/file-upload";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { ImportPreview } from "../../../components/transactions/import/import-preview";
import { ImportSummary } from "../../../components/transactions/import/import-summary";
import { MappingManager } from "../../../components/transactions/import/mapping-manager";
import { useImport } from "../../../hooks/useImport";
import type { ImportMapping, TransactionImport } from "../../../types/import";

interface ColumnMapping {
  sourceColumn: string;
  targetField: string;
}

const TARGET_FIELDS = [
  { id: "date", label: "Date" },
  { id: "merchant", label: "Merchant" },
  { id: "amount", label: "Amount" },
  { id: "notes", label: "Notes" },
];

const DATE_FORMATS = [
  { value: "dd/MM/yyyy", label: "DD/MM/YYYY" },
  { value: "MM/dd/yyyy", label: "MM/DD/YYYY" },
  { value: "yyyy-MM-dd", label: "YYYY-MM-DD" },
  { value: "dd-MM-yyyy", label: "DD-MM-YYYY" },
  { value: "dd.MM.yyyy", label: "DD.MM.YYYY" },
  { value: "yyyy.MM.dd", label: "YYYY.MM.DD" },
];

export function ImportPage() {
  const [fileColumns, setFileColumns] = useState<string[]>([]);
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [dateFormat, setDateFormat] = useState("dd/MM/yyyy");
  const [transactions, setTransactions] = useState<TransactionImport[]>([]);
  const [importComplete, setImportComplete] = useState(false);
  const { processFile, importTransactions, loading, error } = useImport();

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleLoadMapping = (mapping: ImportMapping) => {
    const newMappings = fileColumns.map(column => ({
      sourceColumn: column,
      targetField: mapping.columnMappings[column] || 'none',
    }));
    setColumnMappings(newMappings);
    setDateFormat(mapping.dateFormat);
  };

  const handleFileUpload = async (file: File) => {
    try {
      setFileError(null);
      setUploadedFile(file);
      setFileColumns([]);
      setColumnMappings([]);
      setTransactions([]);
      setImportComplete(false);

      const columns = await getFileColumns(file);
      setFileColumns(columns);

      const initialMappings = columns.map(column => ({
        sourceColumn: column,
        targetField: guessTargetField(column) || 'none'
      }));
      setColumnMappings(initialMappings);
    } catch (err) {
      console.error('Error uploading file:', err);
      setFileError(err instanceof Error ? err.message : 'Failed to read file');
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
        if (targetField && targetField !== 'none') {
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
          <div className="space-y-6">
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
                        onValueChange={(value) => handleMappingChange(sourceColumn, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Skip this column</SelectItem>
                          {TARGET_FIELDS.map((field) => (
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Format</label>
                <Select value={dateFormat} onValueChange={setDateFormat}>
                  <SelectTrigger>
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
              </div>

              <div className="flex justify-end">
                <Button onClick={handlePreview} disabled={loading}>
                  Preview Import
                </Button>
              </div>
            </div>

            <MappingManager
              columnMappings={columnMappings.reduce((acc, { sourceColumn, targetField }) => {
                if (targetField && targetField !== 'none') {
                  acc[sourceColumn] = targetField;
                }
                return acc;
              }, {} as Record<string, string>)}
              dateFormat={dateFormat}
              onLoadMapping={handleLoadMapping}
            />
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

// Helper functions
function guessTargetField(columnName: string): string {
  const normalized = columnName.toLowerCase();
  
  if (normalized.includes('date') || normalized.includes('data')) return 'date';
  if (normalized.includes('merchant') || normalized.includes('nome')) return 'merchant';
  if (normalized.includes('amount') || normalized.includes('importo')) return 'amount';
  if (normalized.includes('note') || normalized.includes('description')) return 'notes';
  
  return 'none';
}

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
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const firstLine = content.split('\n')[0];
          const columns = firstLine.split(',').map(col => col.trim());
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