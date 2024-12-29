import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Transaction } from '@/types/transactions';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select(`
            *,
            category:expense_categories(
              id,
              name
            )
          `)
          .order('date', { ascending: false });

        if (error) throw error;

        setTransactions(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  return { transactions, loading, error };
}
