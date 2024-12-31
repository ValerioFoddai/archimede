import { useState, useEffect } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { useToast } from './useToast';
import type { TransactionFormData, Transaction } from '@/types/transactions';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_transactions')
        .select(`
          *,
          transaction_tags (
            tag_id
          )
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      // Transform the data to match our Transaction type
      const transformedData = data.map(transaction => ({
        id: transaction.id,
        bankId: transaction.bank_id,
        date: transaction.date,
        merchant: transaction.merchant,
        amount: transaction.amount,
        mainCategoryId: transaction.main_category_id,
        subCategoryId: transaction.sub_category_id,
        tagIds: transaction.transaction_tags.map(tt => tt.tag_id),
        notes: transaction.notes,
        userId: transaction.user_id,
        createdAt: transaction.created_at,
      }));

      setTransactions(transformedData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (data: TransactionFormData): Promise<Transaction | null> => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create transactions",
        variant: "destructive",
      });
      return null;
    }

    try {
      setLoading(true);

      // Prepare transaction data
      const transactionData = {
        user_id: user.id,
        bank_id: data.bankId,
        date: data.date.toISOString(),
        merchant: data.merchant,
        amount: parseFloat(data.amount),
        main_category_id: data.mainCategoryId || null,
        sub_category_id: data.subCategoryId || null,
        notes: data.notes || null,
      };

      // Create the transaction
      const { data: transaction, error: transactionError } = await supabase
        .from('user_transactions')
        .insert([transactionData])
        .select()
        .single();

      if (transactionError) throw transactionError;

      // If there are tags, create the tag associations
      if (data.tagIds?.length) {
        const { error: tagsError } = await supabase
          .from('transaction_tags')
          .insert(
            data.tagIds.map(tagId => ({
              transaction_id: transaction.id,
              tag_id: tagId,
            }))
          );

        if (tagsError) throw tagsError;
      }

      toast({
        title: "Success",
        description: "Transaction created successfully",
      });

      // Refresh the transactions list
      await fetchTransactions();

      return transaction;
    } catch (error) {
      const pgError = error as PostgrestError;
      console.error('Error creating transaction:', pgError);
      toast({
        title: "Error",
        description: `Failed to create transaction: ${pgError.message}`,
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  return {
    transactions,
    loading,
    createTransaction,
    refresh: fetchTransactions,
  };
}