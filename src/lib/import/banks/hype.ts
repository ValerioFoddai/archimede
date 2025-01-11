import { BankImportConfig } from '@/types/banks';

export const hypeBankConfig: BankImportConfig = {
  fileTypes: ['csv'],
  requiredColumns: ['date', 'description', 'amount'],
  columnMappings: {
    date: 'Data operazione',
    description: 'Descrizione',
    amount: 'Importo',
  },
};
