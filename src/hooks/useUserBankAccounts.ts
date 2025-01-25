import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface UserBankAccount {
  id: number;  // Changed from string to number since it's SERIAL in the database
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

  // Clear any potentially cached data on mount
  useEffect(() => {
    setAccounts([]);
    return () => {
      setAccounts([]);
    };
  }, []);

  async function fetchAccounts() {
    try {
      setLoading(true);
      
      // Check authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('Auth check:', { user, error: authError });
      
      if (authError) throw new Error(`Authentication error: ${authError.message}`);
      if (!user) throw new Error('No user found');

      // Verify database connection and table access
      console.log('Database connection test:');
      
      // Test direct table access
      const { data: rawData, error: rawError } = await supabase
        .from('user_bank_accounts')
        .select('*')
        .eq('user_id', user.id);
      
      console.log('Direct table query:', {
        success: !rawError,
        error: rawError?.message,
        rawCount: rawData?.length,
        rawData: rawData
      });

      // Test join with banks table
      const { data: joinData, error: joinError } = await supabase
        .from('user_bank_accounts')
        .select('*, bank:banks(*)')
        .eq('user_id', user.id);

      console.log('Join query test:', {
        success: !joinError,
        error: joinError?.message,
        joinCount: joinData?.length,
        joinData: joinData
      });

      // Fetch actual accounts
      const { data, error } = await supabase
        .from('user_bank_accounts')
        .select(`
          *,
          bank:banks(name)
        `)
        .eq('user_id', user.id)
        .order('account_name');

      console.log('Final query result:', {
        success: !error,
        error: error?.message,
        count: data?.length,
        data: data
      });

      if (error) {
        console.error('Database error fetching accounts:', error);
        throw error;
      }

      // Log detailed account information
      console.log('Database query result:', {
        count: data?.length || 0,
        accounts: data?.map(acc => ({
          id: acc.id,
          name: acc.account_name,
          bank: acc.bank?.name,
          balance: acc.balance
        }))
      });

      setAccounts(data || []);
    } catch (err) {
      console.error('Error fetching bank accounts:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch bank accounts'));
    } finally {
      setLoading(false);
    }
  }

  async function checkAccountNameExists(accountName: string, excludeId?: number) {
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
      console.log('Adding account for user:', user);
      
      if (!user) throw new Error('No user found');

      if (await checkAccountNameExists(data.account_name)) {
        throw new Error('An account with this name already exists');
      }

      console.log('Inserting bank account with data:', {
        user_id: user.id,
        ...data,
      });

      const { data: insertedData, error } = await supabase
        .from('user_bank_accounts')
        .insert([
          {
            user_id: user.id,
            ...data,
          },
        ])
        .select();

      if (error) throw error;

      console.log('Inserted bank account:', insertedData);

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

  async function updateAccount(id: number, data: {
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

  async function deleteAccount(id: number) {
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
