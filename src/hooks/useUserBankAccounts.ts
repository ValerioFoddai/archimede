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

  async function checkAccountNameExists(accountName: string, excludeId?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');

    let query = supabase
      .from('user_bank_accounts')
      .select('id')
      .eq('user_id', user.id)
      .eq('account_name', accountName);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data: existing } = await query.maybeSingle();
    return existing !== null;
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

      if (await checkAccountNameExists(data.account_name)) {
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

  async function updateAccount(id: string, data: {
    account_name: string;
    balance: number;
    description?: string;
  }) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Check if new account name already exists (excluding current account)
      if (await checkAccountNameExists(data.account_name, id)) {
        throw new Error('An account with this name already exists');
      }

      const { error } = await supabase
        .from('user_bank_accounts')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh accounts list
      await fetchAccounts();
    } catch (err) {
      console.error('Error updating bank account:', err);
      throw err instanceof Error ? err : new Error('Failed to update bank account');
    }
  }

  async function deleteAccount(id: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // First delete all transaction_bank_accounts records for this bank account
      const { error: mappingError } = await supabase
        .from('transaction_bank_accounts')
        .delete()
        .eq('user_bank_accounts_id', id);

      if (mappingError) throw mappingError;

      // Then delete the bank account
      const { error } = await supabase
        .from('user_bank_accounts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh accounts list
      await fetchAccounts();
    } catch (err) {
      console.error('Error deleting bank account:', err);
      throw err instanceof Error ? err : new Error('Failed to delete bank account');
    }
  }

  return {
    accounts,
    loading,
    error,
    addAccount,
    updateAccount,
    deleteAccount,
    refresh: fetchAccounts,
  };
}
