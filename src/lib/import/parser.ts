import { parse } from 'papaparse';
import { read, utils } from 'xlsx';
import { parse as parseDate, isValid } from 'date-fns';
import { ImportConfig, TransactionImport } from '../../types/import';

// Common date formats to try if no format is specified
const COMMON_DATE_FORMATS = [
  'dd/MM/yyyy',
  'MM/dd/yyyy',
  'yyyy-MM-dd',
  'dd-MM-yyyy',
  'dd.MM.yyyy',
  'yyyy.MM.dd',
];

function parseAmount(value: string): number {
  // Remove currency symbols, spaces, and handle different decimal/thousand separators
  const cleanAmount = value
    .replace(/[^0-9.,\-]/g, '') // Remove all non-numeric chars except . , and -
    .replace(/\s/g, '') // Remove spaces
    .trim();

  // Handle different decimal separators
  let normalizedAmount = cleanAmount;
  if (cleanAmount.includes(',')) {
    // If there's a comma, determine if it's a decimal or thousand separator
    const parts = cleanAmount.split(',');
    if (parts[parts.length - 1].length === 2) {
      // Likely a decimal separator (e.g., 1.234,56)
      normalizedAmount = cleanAmount.replace(/\./g, '').replace(',', '.');
    } else {
      // Likely a thousand separator (e.g., 1,234.56)
      normalizedAmount = cleanAmount.replace(/,/g, '');
    }
  }

  const amount = Number(normalizedAmount);
  if (isNaN(amount)) throw new Error('Invalid amount format');
  return amount;
}

function tryParseDate(value: string, format?: string): Date | null {
  if (!value) return null;

  // If format is provided, try it first
  if (format) {
    const date = parseDate(value, format, new Date());
    if (isValid(date)) return date;
  }

  // Try common formats
  for (const fmt of COMMON_DATE_FORMATS) {
    const date = parseDate(value, fmt, new Date());
    if (isValid(date)) return date;
  }

  // Try parsing as ISO date
  const isoDate = new Date(value);
  if (isValid(isoDate)) return isoDate;

  return null;
}

async function parseCSV(file: File): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    parse(file, {
      header: true,
      skipEmptyLines: true,
      encoding: 'UTF-8',
      complete: (results) => {
        if (!results.data || results.data.length === 0) {
          reject(new Error('No data found in file'));
        } else {
          resolve(results.data as Record<string, string>[]);
        }
      },
      error: (error) => reject(new Error(`Failed to parse CSV: ${error.message}`)),
    });
  });
}

async function parseXLSX(file: File): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        // Get headers and data separately
        const headers = utils.sheet_to_json<string[]>(firstSheet, { 
          header: 1,
          raw: false,
          defval: '',
          range: 0
        })[0];

        if (!headers || headers.length === 0) {
          reject(new Error('No headers found in file'));
          return;
        }

        // Get data rows
        const jsonData = utils.sheet_to_json<Record<string, string>>(firstSheet, {
          header: headers,
          raw: false,
          defval: ''
        });

        if (jsonData.length === 0) {
          reject(new Error('No data found in file'));
          return;
        }

        resolve(jsonData);
      } catch (error) {
        reject(new Error(`Failed to parse XLSX: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

export async function parseImportFile(
  file: File,
  config: ImportConfig
): Promise<TransactionImport[]> {
  try {
    if (!file) throw new Error('No file provided');

    // Parse file based on type
    const rows = file.name.toLowerCase().endsWith('.xlsx') 
      ? await parseXLSX(file)
      : await parseCSV(file);

    return rows.map((row, index) => {
      try {
        return transformRow(row, config);
      } catch (error) {
        console.error('Error transforming row:', error, { row, config });
        return {
          date: new Date(),
          merchant: row[config.columnMappings.merchant] || '',
          amount: 0,
          notes: null,
          status: 'error' as const,
          errors: [(error as Error).message],
        };
      }
    });
  } catch (error) {
    throw new Error(`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function transformRow(
  row: Record<string, string>,
  config: ImportConfig
): TransactionImport {
  try {
    // Get date - try multiple date columns if primary is empty
    const dateColumn = config.columnMappings.date;
    if (!dateColumn) throw new Error('Date column not mapped');
    
    let dateValue = row[dateColumn];
    if (!dateValue) {
      // Try alternative date columns
      const altDateColumns = Object.keys(row).filter(col => 
        col.toLowerCase().includes('data') || 
        col.toLowerCase().includes('date')
      );
      
      for (const col of altDateColumns) {
        if (row[col]) {
          dateValue = row[col];
          break;
        }
      }
    }
    
    if (!dateValue) throw new Error('Date is required');
    
    const date = tryParseDate(dateValue, config.dateFormat);
    if (!date) throw new Error('Invalid date format');

    // Get amount
    const amountColumn = config.columnMappings.amount;
    if (!amountColumn) throw new Error('Amount column not mapped');
    const amountValue = row[amountColumn];
    if (!amountValue) throw new Error('Amount is required');
    
    const amount = parseAmount(amountValue);

    // Get merchant and notes
    const merchantColumn = config.columnMappings.merchant;
    if (!merchantColumn) throw new Error('Merchant column not mapped');
    const merchant = row[merchantColumn]?.trim() || '';
    if (!merchant) throw new Error('Merchant is required');
    
    const notesColumn = config.columnMappings.notes;
    const notes = notesColumn ? row[notesColumn]?.trim() || null : null;

    return {
      date,
      merchant,
      amount,
      notes,
      status: 'pending',
      errors: [],
    };
  } catch (error) {
    console.error('Error transforming row:', error, { row, config });
    throw error;
  }
}