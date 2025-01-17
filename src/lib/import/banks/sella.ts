import { BankImportConfig } from '@/types/banks';

export const sellaBankConfig: BankImportConfig = {
  fileTypes: ['csv'],
  requiredColumns: ['date', 'merchant', 'amount'],
  columnMappings: {
    date: 'Data operazione',
    merchant: 'Descrizione',
    notes: 'Etichette',
    // Handle Credito (positive) and Debito (negative) columns
    amount: 'Credito|Debito',
  },
  skipRows: 1, // Skip header row
  dateFormat: 'dd/MM/yyyy', // Specify date format
  // Custom validation to skip footer row
  validateRow: (row: Record<string, string>) => {
    return row['Data operazione'] !== '' && row['Descrizione'] !== 'Saldo al';
  },
};
