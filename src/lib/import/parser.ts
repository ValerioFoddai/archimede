import { parse } from 'papaparse';
import { TransactionImport } from '../../types/import';

interface ImportConfig {
  columnMappings: Record<string, string>;
}

export async function parseImportFile(
  file: File,
  config: ImportConfig
): Promise<TransactionImport[]> {
  return new Promise((resolve, reject) => {
    try {
      if (!file) {
        throw new Error('No file provided');
      }

      parse(file, {
        header: true,
        skipEmptyLines: true,
        encoding: 'UTF-8',
        complete: (results) => {
          try {
            if (!results.data || results.data.length === 0) {
              throw new Error('No data found in file');
            }

            const transactions = (results.data as Record<string, string>[]).map((row, index) => {
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

            resolve(transactions);
          } catch (error) {
            reject(error);
          }
        },
        error: (error) => {
          reject(new Error(`Failed to parse CSV file: ${error.message}`));
        },
      });
    } catch (error) {
      reject(error);
    }
  });
}

function transformRow(
  row: Record<string, string>,
  config: ImportConfig
): TransactionImport {
  try {
    // Get date column value and parse it
    const dateColumn = config.columnMappings.date;
    if (!dateColumn) throw new Error('Date column not mapped');
    const dateValue = row[dateColumn];
    if (!dateValue) throw new Error('Date is required');
    
    const [day, month, year] = dateValue.split('/');
    if (!day || !month || !year) throw new Error('Invalid date format. Expected: DD/MM/YYYY');
    
    // Create date at noon UTC to avoid timezone issues
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), 12));
    if (isNaN(date.getTime())) throw new Error('Invalid date');

    // Get amount column value and parse it
    const amountColumn = config.columnMappings.amount;
    if (!amountColumn) throw new Error('Amount column not mapped');
    const amountValue = row[amountColumn];
    if (!amountValue) throw new Error('Amount is required');
    
    // Clean up amount string - remove € symbol, spaces, and handle decimal separator
    const cleanAmount = amountValue
      .replace(/[€\s]/g, '') // Remove € symbol and all whitespace
      .trim();
    const amount = Number(cleanAmount);
    if (isNaN(amount)) throw new Error('Invalid amount');

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
