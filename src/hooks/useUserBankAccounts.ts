import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface UserBankAccount {
  id: string;
  user_id: string;
  bank_id: string;
  account_name: string;
  balance: number;
  description: string | null;
  created_at: string;
  bank: {
    name: string;
  };
}

export function useUserBankAccounts() {
  const [accounts, setAccounts] = useState<UserBankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  async function fetchAccounts() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('user_bank_accounts')
        .select(`
          *,
          bank:banks(name)
        `)
        .eq('user_id', user.id)
        .order('account_name');

      if (error) throw error;
      setAccounts(data || []);
    } catch (err) {
      console.error('Error fetching bank accounts:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch bank accounts'));
    } finally {
      setLoading(false);
    }
  }

  async function addAccount(data: {
    bank_id: string;
    account_name: string;
    balance: number;
    description?: string;
  }) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      // Check if account name already exists for this user
      const { data: existing } = await supabase
        .from('user_bank_accounts')
        .select('id')
        .eq('user_id', user.id)
        .eq('account_name', data.account_name)
        .single();

      if (existing) {
        throw new Error('An account with this name already exists');
      }

      const { error } = await supabase
        .from('user_bank_accounts')
        .insert([
          {
            user_id: user.id,
            ...data,
          },
        ]);

      if (error) throw error;

      // Refresh accounts list
      await fetchAccounts();
    } catch (err) {
      console.error('Error adding bank account:', err);
      throw err instanceof Error ? err : new Error('Failed to add bank account');
    }
  }

  useEffect(() => {
    fetchAccounts();
  }, []);

  return {
    accounts,
    loading,
    error,
    addAccount,
    refresh: fetchAccounts,
  };
}
