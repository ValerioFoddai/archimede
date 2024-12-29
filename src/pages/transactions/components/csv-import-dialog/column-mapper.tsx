import { useEffect, useState } from 'react';
import { BankTemplateWithMappings } from '../../../../types/bank-templates';
import { Button } from '../../../../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../components/ui/table';

interface ColumnMapperProps {
  file: File;
  template: BankTemplateWithMappings;
  onConfirm: () => void;
}

interface PreviewData {
  headers: string[];
  rows: string[][];
}

export function ColumnMapper({ file, template, onConfirm }: ColumnMapperProps) {
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const readCSV = async () => {
      try {
        setLoading(true);
        const text = await file.text();
        const lines = text.split('\n');
        
        if (lines.length < 2) {
          throw new Error('CSV file must contain at least headers and one row');
        }

        // Parse headers and first few rows for preview
        const headers = lines[0].split(',').map(h => h.trim());
        const previewRows = lines
          .slice(1, 6) // Preview first 5 rows
          .map(line => line.split(',').map(cell => cell.trim()))
          .filter(row => row.length === headers.length); // Filter out malformed rows

        setPreview({
          headers,
          rows: previewRows,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to read CSV file');
      } finally {
        setLoading(false);
      }
    };

    readCSV();
  }, [file]);

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading preview...</div>;
  }

  if (error || !preview) {
    return (
      <div className="text-sm text-destructive">
        {error || 'Failed to generate preview'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Column Mappings</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CSV Column</TableHead>
                <TableHead>Maps To</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {template.column_mappings.map((mapping) => {
                const sourceExists = preview.headers.includes(mapping.source_column);
                return (
                  <TableRow key={mapping.id}>
                    <TableCell>
                      <span className={!sourceExists ? 'text-destructive' : ''}>
                        {mapping.source_column}
                        {!sourceExists && ' (missing)'}
                      </span>
                    </TableCell>
                    <TableCell>{mapping.target_column}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Data Preview</h3>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {preview.headers.map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {preview.rows.map((row, i) => (
                <TableRow key={i}>
                  {row.map((cell, j) => (
                    <TableCell key={`${i}-${j}`}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={onConfirm}
          disabled={template.column_mappings.some(
            (mapping) => !preview.headers.includes(mapping.source_column)
          )}
        >
          Confirm Mappings
        </Button>
      </div>
    </div>
  );
}
