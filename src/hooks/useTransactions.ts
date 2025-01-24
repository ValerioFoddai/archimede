import { useState, useEffect } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { useToast } from './useToast';
import { eventEmitter, TRANSACTION_UPDATED } from '@/lib/events';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import type { TransactionFormData, Transaction } from '../types/transactions';

interface TransactionTag {
  tag_id: string;
}

interface RawTransaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  main_category_id: number | null;
  sub_category_id: number | null;
  notes: string | null;
  user_id: string;
  created_at: string;
  bank_account: string | null;
  bank_account_id: string | null;
  transaction_tags: TransactionTag[];
}

import type { TimeRange } from '../types/transactions';

export function useTransactions(timeRange?: TimeRange) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const getDateFilter = () => {
    if (!timeRange) return null;

    console.log('Getting date filter for timeRange:', timeRange);

    // Handle month range (format: month-YYYY-MM)
    const monthMatch = timeRange.match(/^month-(\d{4})-(\d{2})$/);
    if (monthMatch) {
      const [_, year, month] = monthMatch;
      const date = new Date(parseInt(year), parseInt(month) - 1);
      const filter = {
        start: format(startOfMonth(date), 'yyyy-MM-dd'),
        end: format(endOfMonth(date), 'yyyy-MM-dd')
      };
      console.log('Monthly filter:', filter);
      return filter;
    }

    // Handle custom date range (format: custom-YYYY-MM-DD-YYYY-MM-DD)
    const customMatch = timeRange.match(/^custom-(\d{4}-\d{2}-\d{2})-(\d{4}-\d{2}-\d{2})$/);
    if (customMatch) {
      const [_, start, end] = customMatch;
      const filter = {
        start,
        end
      };
      console.log('Custom date filter:', filter);
      return filter;
    }

    console.log('No date filter applied');
    return null;
  };

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      let query = supabase
        .from('user_transactions')
        .select(`
          *,
          transaction_tags (
            tag_id
          )
        `)
        .eq('user_id', user.id);

      const dateFilter = getDateFilter();
      if (dateFilter) {
        query = query
          .gte('date', dateFilter.start)
          .lte('date', dateFilter.end);
      }

      const { data, error } = await query.order('date', { ascending: false });

      if (error) throw error;

      const transformedData = (data as RawTransaction[]).map(transaction => ({
        id: transaction.id,
        date: new Date(transaction.date),
        merchant: transaction.merchant,
        amount: transaction.amount,
        mainCategoryId: transaction.main_category_id || undefined,
        subCategoryId: transaction.sub_category_id || undefined,
        tagIds: transaction.transaction_tags.map(tt => tt.tag_id),
        notes: transaction.notes || undefined,
        bankAccountId: transaction.bank_account_id,
        bankAccount: transaction.bank_account,
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
      const formattedDate = format(data.date, 'yyyy-MM-dd');
      
      // First create the transaction
      const transactionData = {
        user_id: user.id,
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

      // Then create bank account association if selected
      if (data.bankAccountId) {
        const { error: bankAccountError } = await supabase
          .from('transaction_bank_accounts')
          .insert([{
            transaction_id: transaction.id,
            user_bank_accounts_id: data.bankAccountId,
          }]);

        if (bankAccountError) throw bankAccountError;
      }

      // Finally create tag associations
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
      eventEmitter.emit(TRANSACTION_UPDATED);
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
      const formattedDate = format(data.date, 'yyyy-MM-dd');
      
      console.log('Updating transaction with data:', { id, ...data });
      
      // First update the transaction
      const transactionData = {
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

      // Update bank account association
      await supabase
        .from('transaction_bank_accounts')
        .delete()
        .eq('transaction_id', id);

      if (data.bankAccountId) {
        const { error: bankAccountError } = await supabase
          .from('transaction_bank_accounts')
          .insert([{
            transaction_id: id,
            user_bank_accounts_id: data.bankAccountId,
          }]);

        if (bankAccountError) throw bankAccountError;
      }

      // Update tag associations
      await supabase
        .from('transaction_tags')
        .delete()
        .eq('transaction_id', id);

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
      eventEmitter.emit(TRANSACTION_UPDATED);
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

  const applyTransactionRules = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch all rules
      const { data: rules, error: rulesError } = await supabase
        .from('user_transactions_rules')
        .select('*')
        .eq('user_id', user.id);

      if (rulesError) throw rulesError;

      // Fetch all transactions
      const { data: dbTransactions, error: transactionsError } = await supabase
        .from('user_transactions')
        .select('*')
        .eq('user_id', user.id);

      if (transactionsError) throw transactionsError;

      let updatedCount = 0;
      const errors = [];

      // Apply rules to transactions
      for (const transaction of dbTransactions) {
        try {
          // Skip already categorized transactions
          if (transaction.main_category_id !== null) {
            continue;
          }

          // Find matching rule
          let matchingRule = null;
          for (const rule of rules) {
            const merchantLower = transaction.merchant.toLowerCase().trim();
            const keywordsLower = rule.keywords.toLowerCase().trim();
            const isMatch = merchantLower.includes(keywordsLower);
            
            if (isMatch) {
              matchingRule = rule;
              break;
            }
          }

          if (matchingRule) {
            // Get main category
            const { data: mainCategories, error: mainCatError } = await supabase
              .from('main_expense_categories')
              .select('id, name')
              .ilike('name', matchingRule.main_category);

            if (mainCatError) throw mainCatError;
            if (!mainCategories?.length) {
              console.error(`Main category not found: ${matchingRule.main_category}`);
              continue;
            }

            const mainCategory = mainCategories[0];

            // Get sub category
            const { data: subCategories, error: subCatError } = await supabase
              .from('sub_expense_categories')
              .select('id, name')
              .eq('main_category_id', mainCategory.id)
              .ilike('name', matchingRule.sub_category);

            if (subCatError) throw subCatError;
            if (!subCategories?.length) {
              console.error(`Sub category not found: ${matchingRule.sub_category}`);
              continue;
            }

            const subCategory = subCategories[0];

            // Update transaction
            const { error: updateError } = await supabase
              .from('user_transactions')
              .update({
                main_category_id: mainCategory.id,
                sub_category_id: subCategory.id
              })
              .eq('id', transaction.id)
              .eq('user_id', user.id);

            if (updateError) throw updateError;
            updatedCount++;
          }
        } catch (error) {
          console.error('Error processing transaction:', error);
          errors.push(error);
        }
      }

      // Show appropriate toast message
      if (errors.length > 0) {
        toast({
          title: "Warning",
          description: `Applied rules with ${errors.length} errors. Check console for details.`,
          variant: "destructive",
        });
      } else if (updatedCount === 0) {
        toast({
          title: "Info",
          description: "No matching rules found for uncategorized transactions.",
        });
      } else {
        toast({
          title: "Success",
          description: `Successfully categorized ${updatedCount} transaction${updatedCount === 1 ? '' : 's'}.`,
        });
      }

      await fetchTransactions();
      eventEmitter.emit(TRANSACTION_UPDATED);
    } catch (error) {
      console.error('Error applying transaction rules:', error);
      toast({
        title: "Error",
        description: "Failed to apply transaction rules",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string): Promise<boolean> => {
    if (!user || !id) return false;

    try {
      setLoading(true);
      // Due to ON DELETE CASCADE, we only need to delete the transaction
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
      eventEmitter.emit(TRANSACTION_UPDATED);
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
    console.log('useEffect triggered with timeRange:', timeRange);
    fetchTransactions();
  }, [user, timeRange]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    transactions,
    loading,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    applyTransactionRules,
    refresh: fetchTransactions,
  };
}
