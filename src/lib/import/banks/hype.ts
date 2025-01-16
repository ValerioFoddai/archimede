import { BankImportConfig } from '@/types/banks';

export const hypeBankConfig: BankImportConfig = {
  fileTypes: ['csv'],
  requiredColumns: ['date', 'merchant', 'amount'],
  columnMappings: {
    date: 'Data operazione',
    merchant: 'Nome',
    notes: 'Descrizione',
    amount: 'Importo ( € )',
  },
};
