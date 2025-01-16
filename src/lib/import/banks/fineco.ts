import { BankImportConfig } from '@/types/banks';

export const finecoBankConfig: BankImportConfig = {
  fileTypes: ['xlsx'],
  requiredColumns: ['date', 'merchant', 'amount'],
  columnMappings: {
    date: 'Data',
    merchant: 'Descrizione_Completa',
    notes: 'Descrizione',
    amount: 'Entrate|Uscite', // Special case: need to handle both columns for amount - will be parsed specially
  },
  skipRows: 6, // Skip the first 6 rows of header information
};
