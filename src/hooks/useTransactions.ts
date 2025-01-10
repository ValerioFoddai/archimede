import { useState, useEffect } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { useToast } from './useToast';
import { format } from 'date-fns';
import type { TransactionFormData, Transaction } from '../types/transactions';

interface TransactionTag {
  tag_id: string;  // Changed to string to match Transaction interface
}

interface RawTransaction {
  id: string;
  bank_id: string | null;
  date: string;
  merchant: string;
  amount: number;
  main_category_id: number | null;
  sub_category_id: number | null;
  notes: string | null;
  user_id: string;
  created_at: string;
  transaction_tags: TransactionTag[];
}

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

      const transformedData = (data as RawTransaction[]).map(transaction => ({
        id: transaction.id,
        bankId: transaction.bank_id || undefined,
        date: new Date(transaction.date),
        merchant: transaction.merchant,
        amount: transaction.amount,
        mainCategoryId: transaction.main_category_id || undefined,
        subCategoryId: transaction.sub_category_id || undefined,
        tagIds: transaction.transaction_tags.map(tt => tt.tag_id),
        notes: transaction.notes || undefined,
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
    if (!user) return null;

    try {
      setLoading(true);
      // Format date as YYYY-MM-DD to preserve local date
      const formattedDate = format(data.date, 'yyyy-MM-dd');
      
      const transactionData = {
        user_id: user.id,
        bank_id: data.bankId || null,
        date: formattedDate,
        merchant: data.merchant,
        amount: parseFloat(data.amount),
        main_category_id: data.mainCategoryId || null,
        sub_category_id: data.subCategoryId || null,
        notes: data.notes || null,
      };

      const { data: transaction, error: transactionError } = await supabase
        .from('user_transactions')
        .insert([transactionData])
        .select()
        .single();

      if (transactionError) throw transactionError;

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

      await fetchTransactions();
      return transaction;
    } catch (error) {
      const pgError = error as PostgrestError;
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

  const updateTransaction = async (id: string, data: TransactionFormData): Promise<Transaction | null> => {
    if (!user || !id) return null;

    try {
      setLoading(true);
      // Format date as YYYY-MM-DD to preserve local date
      const formattedDate = format(data.date, 'yyyy-MM-dd');
      
      const transactionData = {
        bank_id: data.bankId || null,
        date: formattedDate,
        merchant: data.merchant,
        amount: parseFloat(data.amount),
        main_category_id: data.mainCategoryId || null,
        sub_category_id: data.subCategoryId || null,
        notes: data.notes || null,
      };

      const { error: transactionError } = await supabase
        .from('user_transactions')
        .update(transactionData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (transactionError) throw transactionError;

      // Delete existing tags
      await supabase
        .from('transaction_tags')
        .delete()
        .eq('transaction_id', id);

      // Insert new tags
      if (data.tagIds?.length) {
        const { error: tagsError } = await supabase
          .from('transaction_tags')
          .insert(
            data.tagIds.map(tagId => ({
              transaction_id: id,
              tag_id: tagId,
            }))
          );

        if (tagsError) throw tagsError;
      }

      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });

      await fetchTransactions();
      return transactions.find(t => t.id === id) || null;
    } catch (error) {
      const pgError = error as PostgrestError;
      toast({
        title: "Error",
        description: `Failed to update transaction: ${pgError.message}`,
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string): Promise<boolean> => {
    if (!user || !id) return false;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('user_transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });

      await fetchTransactions();
      return true;
    } catch (error) {
      const pgError = error as PostgrestError;
      toast({
        title: "Error",
        description: `Failed to delete transaction: ${pgError.message}`,
        variant: "destructive",
      });
      return false;
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
    updateTransaction,
    deleteTransaction,
    refresh: fetchTransactions,
  };
}
