import { TransactionImport, ImportSummary } from '@/types/import';

export function generateImportSummary(
  transactions: TransactionImport[],
  errors: Array<{ row: number; message: string; }>
): ImportSummary {
  return {
    total: transactions.length,
    successful: transactions.filter(t => t.status === 'success').length,
    duplicates: transactions.filter(t => t.status === 'duplicate').length,
    failed: transactions.filter(t => t.status === 'error').length,
    errors,
  };
}