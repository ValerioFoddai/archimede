import { parse } from 'papaparse';
import { parse as parseDate, isValid } from 'date-fns';
import { read, utils, Sheet2JSONOpts } from 'xlsx';
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

  // Extract year from the value if possible
  const yearMatch = value.match(/\b(20\d{2})\b/);
  const referenceDate = yearMatch 
    ? new Date(parseInt(yearMatch[1]), 0, 1) // Use January 1st of the matched year
    : new Date();

  // If format is provided, try it first
  if (format) {
    const date = parseDate(value, format, referenceDate);
    if (isValid(date)) return date;
  }

  // Try common formats
  for (const fmt of COMMON_DATE_FORMATS) {
    const date = parseDate(value, fmt, referenceDate);
    if (isValid(date)) return date;
  }

  // Try parsing as ISO date
  const isoDate = new Date(value);
  if (isValid(isoDate)) return isoDate;

  return null;
}

async function parseFile(file: File, config: ImportConfig): Promise<Record<string, string>[]> {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  if (fileExtension === 'xlsx') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const options: Sheet2JSONOpts = {
            header: 1, // Use 1-based array of values for all rows
            raw: false, // Convert all values to strings
          };
          
          // Get all rows as arrays first
          const allRows = utils.sheet_to_json<string[]>(firstSheet, options);
          
          // Skip header rows if configured
          const dataRows = config.skipRows ? allRows.slice(config.skipRows) : allRows;
          
          // Get headers from the first row of data
          const headers = dataRows[0];
          
          // Convert remaining rows to objects using headers
          const rows = dataRows.slice(1).map(row => {
            const obj: Record<string, string> = {};
            headers.forEach((header: string, index: number) => {
              if (row[index] !== undefined) {
                obj[header] = String(row[index]);
              }
            });
            return obj;
          });
          resolve(rows);
        } catch (error) {
          reject(new Error(`Failed to parse XLSX: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

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

export async function parseImportFile(
  file: File,
  config: ImportConfig
): Promise<TransactionImport[]> {
  try {
    if (!file) throw new Error('No file provided');

    // Parse file based on type
    const rows = await parseFile(file, config);

    return rows.map((row) => {
      try {
        return transformRow(row, config);
      } catch (error) {
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
    // Get date
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

    // Get amount - handle special case for Fineco's two amount columns
    const amountColumn = config.columnMappings.amount;
    if (!amountColumn) throw new Error('Amount column not mapped');
    
    let amount = 0;
    if (amountColumn.includes('|')) {
      // Handle split amount columns (e.g., "Entrate|Uscite" for Fineco)
      const [positiveCol, negativeCol] = amountColumn.split('|');
      const positiveAmount = row[positiveCol] ? parseAmount(row[positiveCol]) : 0;
      const negativeAmount = row[negativeCol] ? -Math.abs(parseAmount(row[negativeCol])) : 0;
      amount = positiveAmount + negativeAmount;
    } else {
      const amountValue = row[amountColumn];
      if (!amountValue) throw new Error('Amount is required');
      amount = parseAmount(amountValue);
    }

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
        bank_id: config.bankId,
      };
  } catch (error) {
    console.error('Error transforming row:', error, { row, config });
    throw error;
  }
}
