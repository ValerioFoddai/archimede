import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { parseImportFile } from '../lib/import/parser';
import { checkDuplicates } from '../lib/import/duplicate-checker';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
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

      // Filter out transactions that are not valid for import
      const validTransactions = transactions.filter(t => t.status === 'pending');
      console.log('Transactions to import:', {
        total: transactions.length,
        valid: validTransactions.length,
        duplicates: transactions.filter(t => t.status === 'duplicate').length,
        errors: transactions.filter(t => t.status === 'error').length
      });

      if (validTransactions.length === 0) {
        return 0;
      }

      // Double-check for duplicates before insert
      const { data: existingTransactions } = await supabase
        .from('user_transactions')
        .select('date, merchant, amount')
        .eq('user_id', user.id);

      // Prepare transactions for import, with additional duplicate check
      const transactionsToInsert = validTransactions.filter(t => {
        const formattedDate = format(t.date, 'yyyy-MM-dd');
        const isDuplicate = existingTransactions?.some(existing => 
          existing.date === formattedDate &&
          existing.merchant.toLowerCase().trim() === t.merchant.toLowerCase().trim() &&
          existing.amount === t.amount
        );
        
        if (isDuplicate) {
          console.log('Caught duplicate before insert:', {
            date: formattedDate,
            merchant: t.merchant,
            amount: t.amount
          });
          t.status = 'duplicate';
        }
        
        return !isDuplicate;
      }).map(t => ({
        user_id: user.id,
        date: format(t.date, 'yyyy-MM-dd'),
        merchant: t.merchant,
        amount: t.amount,
        notes: t.notes,
        bank_id: t.bank_id,
      }));

      // Insert transactions
      const { error: importError, data: insertedTransactions } = await supabase
        .from('user_transactions')
        .insert(transactionsToInsert)
        .select();

      if (importError) {
        console.error('Database error during transaction insert:', importError);
        throw new Error(`Failed to import transactions: ${importError.message}`);
      }

      // Create transaction-bank account relationships if bank_account_id is provided
      const transactionBankAccounts = validTransactions
        .filter((t, index) => t.bank_account_id && index < insertedTransactions!.length)
        .map((t, index) => ({
          transaction_id: insertedTransactions![index].id,
          user_bank_accounts_id: parseInt(t.bank_account_id!),
          user_id: user.id
        }));

      if (transactionBankAccounts.length > 0) {
        const { error: relationError } = await supabase
          .from('transaction_bank_accounts')
          .insert(transactionBankAccounts);

        if (relationError) {
          console.error('Error creating transaction-bank account relationships:', relationError);
          throw new Error(`Failed to create bank account relationships: ${relationError.message}`);
        }
      }

      // Update the status of imported transactions
      transactions.forEach(t => {
        if (t.status === 'pending') {
          t.status = 'success';
        }
      });

      return insertedTransactions?.length || 0;
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
