import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { parseImportFile } from '../lib/import/parser';
import { checkDuplicates } from '../lib/import/duplicate-checker';
import { supabase } from '../lib/supabase';
import type { TransactionImport } from '../types/import';

import type { ImportConfig } from '../types/import';

export function useImport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const processFile = async (file: File, config: ImportConfig): Promise<TransactionImport[]> => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const transactions = await parseImportFile(file, config);
      return await checkDuplicates(transactions, user.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process file';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const importTransactions = async (transactions: TransactionImport[]): Promise<number> => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const validTransactions = transactions.filter(
        t => t.status !== 'error' && t.status !== 'duplicate'
      );

      const { error: importError } = await supabase
        .from('user_transactions')
        .insert(
          validTransactions.map(t => ({
            user_id: user.id,
            date: t.date.toISOString(),
            merchant: t.merchant,
            amount: t.amount,
            notes: t.notes,
          }))
        );

      if (importError) throw importError;

      return validTransactions.length;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to import transactions';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    processFile,
    importTransactions,
    loading,
    error,
  };
}
