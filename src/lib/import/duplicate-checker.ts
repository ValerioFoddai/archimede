import { supabase } from '@/lib/supabase';
import { TransactionImport } from '@/types/import';

export async function checkDuplicates(
  transactions: TransactionImport[],
  userId: string
): Promise<TransactionImport[]> {
  // Get all user's transactions
  const { data: existingTransactions } = await supabase
    .from('user_transactions')
    .select('date, merchant, amount')
    .eq('user_id', userId);

  console.log('Checking against existing transactions:', {
    count: existingTransactions?.length
  });

  return transactions.map(transaction => {
    // Format the transaction date consistently
    const transactionDate = transaction.date.toISOString().split('T')[0];
    const normalizedMerchant = transaction.merchant.toLowerCase().trim();
    
    // Find exact duplicates
    const duplicates = existingTransactions?.filter(existing => {
      const existingMerchant = existing.merchant.toLowerCase().trim();
      const isExactMatch = existing.date === transactionDate &&
                          existingMerchant === normalizedMerchant &&
                          existing.amount === transaction.amount;
      
      if (isExactMatch) {
        console.log('Found exact duplicate:', {
          new: {
            date: transactionDate,
            merchant: normalizedMerchant,
            amount: transaction.amount
          },
          existing: {
            date: existing.date,
            merchant: existingMerchant,
            amount: existing.amount
          }
        });
      }
      
      return isExactMatch;
    }) || [];

    const isDuplicate = duplicates.length > 0;

    return {
      ...transaction,
      status: isDuplicate ? 'duplicate' : transaction.status,
      errors: isDuplicate 
        ? [...transaction.errors, 'Duplicate transaction found']
        : transaction.errors,
    };
  });
}
