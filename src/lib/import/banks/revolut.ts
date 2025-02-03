import { BankImportConfig } from '@/types/banks';

export const revolutBankConfig: BankImportConfig = {
  fileTypes: ['csv'],
  requiredColumns: ['date', 'merchant', 'amount'],
  columnMappings: {
    date: 'Started Date',
    merchant: 'Description',
    amount: 'Amount',
    notes: 'Type'
  },
  dateFormat: 'yyyy-MM-dd HH:mm:ss', // Revolut uses this format (using lowercase yyyy for date-fns format)
  validateRow: (row) => {
    // Validate that Amount is a valid number and handle comma to dot conversion
    return !isNaN(parseFloat(row.Amount.replace(',', '.')));
  },
  customConfig: {
    // Special handling for Revolut-specific features
    decimalSeparator: ',', // Revolut uses comma as decimal separator
    shouldConvertDecimalSeparator: true // Flag to convert comma to dot
  }
};
