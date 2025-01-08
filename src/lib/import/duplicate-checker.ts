import { supabase } from '@/lib/supabase';
import { TransactionImport } from '@/types/import';

export async function checkDuplicates(
  transactions: TransactionImport[],
  userId: string
): Promise<TransactionImport[]> {
  const { data: existingTransactions } = await supabase
    .from('user_transactions')
    .select('date, merchant, amount')
    .eq('user_id', userId);

  return transactions.map(transaction => {
    const isDuplicate = existingTransactions?.some(existing => 
      existing.date === transaction.date.toISOString().split('T')[0] &&
      existing.merchant === transaction.merchant &&
      existing.amount === transaction.amount
    );

    return {
      ...transaction,
      status: isDuplicate ? 'duplicate' : transaction.status,
      errors: isDuplicate 
        ? [...transaction.errors, 'Duplicate transaction found']
        : transaction.errors,
    };
  });
}