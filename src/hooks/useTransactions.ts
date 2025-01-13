import { useState, useEffect } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { useToast } from './useToast';
import { eventEmitter, TRANSACTION_UPDATED } from '@/lib/events';
import { format, subDays, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import type { TransactionFormData, Transaction } from '../types/transactions';

interface TransactionTag {
  tag_id: string;
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

export type TimeRange = string; // Format: '7d' for last 7 days or 'month-YYYY-MM' for specific month

export function useTransactions(timeRange?: TimeRange) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const getDateFilter = () => {
    if (!timeRange) return null;

    console.log('Getting date filter for timeRange:', timeRange);

    if (timeRange === '7d') {
      const endDate = new Date();
      const startDate = subDays(endDate, 7);
      const filter = {
        start: format(startDate, 'yyyy-MM-dd'),
        end: format(endDate, 'yyyy-MM-dd')
      };
      console.log('Last 7 days filter:', filter);
      return filter;
    }

    const match = timeRange.match(/month-(\d{4})-(\d{2})/);
    if (match) {
      const [_, year, month] = match;
      const date = new Date(parseInt(year), parseInt(month) - 1);
      const filter = {
        start: format(startOfMonth(date), 'yyyy-MM-dd'),
        end: format(endOfMonth(date), 'yyyy-MM-dd')
      };
      console.log('Monthly filter:', filter);
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
        console.log('Applied date filter to query:', {
          filter: dateFilter,
          timeRange,
          start: dateFilter.start,
          end: dateFilter.end
        });
      }

      const { data, error } = await query.order('date', { ascending: false });
      console.log('Fetched transactions:', {
        count: data?.length,
        timeRange,
        dateFilter,
        firstTransaction: data?.[0]?.date,
        lastTransaction: data?.[data.length - 1]?.date
      });

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

  const applyTransactionRules = async () => {
    if (!user) return;

    try {
      setLoading(true);

      console.log('Starting transaction rules automation...');

      // Fetch all rules
      const { data: rules, error: rulesError } = await supabase
        .from('user_transactions_rules')
        .select('*')
        .eq('user_id', user.id);

      if (rulesError) throw rulesError;
      console.log('Fetched rules:', rules);

      // Fetch all transactions
      const { data: dbTransactions, error: transactionsError } = await supabase
        .from('user_transactions')
        .select('*')
        .eq('user_id', user.id);

      if (transactionsError) throw transactionsError;
      console.log('Fetched transactions:', dbTransactions);

      let updatedCount = 0;
      const errors = [];

      // Apply rules to transactions
      for (const transaction of dbTransactions) {
        try {
          // Skip already categorized transactions
          if (transaction.main_category_id !== null) {
            console.log('Skipping already categorized transaction:', transaction.merchant);
            continue;
          }

          console.log('Processing uncategorized transaction:', {
            merchant: transaction.merchant,
            currentMainCategory: transaction.main_category_id,
            currentSubCategory: transaction.sub_category_id
          });

          // Find matching rule
          console.log('Looking for rules matching merchant:', transaction.merchant);
          
          let matchingRule = null;
          for (const rule of rules) {
            const merchantLower = transaction.merchant.toLowerCase().trim();
            const keywordsLower = rule.keywords.toLowerCase().trim();
            const isMatch = merchantLower.includes(keywordsLower);
            
            console.log('Checking rule:', {
              keywords: rule.keywords,
              merchant: transaction.merchant,
              merchantLower,
              keywordsLower,
              isMatch,
              mainCategory: rule.main_category,
              subCategory: rule.sub_category
            });

            if (isMatch) {
              console.log('Found matching rule:', rule);
              matchingRule = rule;
              break;
            }
          }

          if (matchingRule) {
            console.log('Processing matching rule:', matchingRule);

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
            console.log('Found main category:', mainCategory);

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
            console.log('Found sub category:', subCategory);

            console.log('Updating transaction:', {
              transactionId: transaction.id,
              merchant: transaction.merchant,
              mainCategory: mainCategory.name,
              mainCategoryId: mainCategory.id,
              subCategory: subCategory.name,
              subCategoryId: subCategory.id
            });

            // Update transaction
            const { data: updatedTransaction, error: updateError } = await supabase
              .from('user_transactions')
              .update({
                main_category_id: mainCategory.id,
                sub_category_id: subCategory.id
              })
              .eq('id', transaction.id)
              .eq('user_id', user.id)
              .select()
              .single();

            if (updateError) {
              console.error('Error updating transaction:', updateError);
              throw updateError;
            }

            if (!updatedTransaction) {
              throw new Error('Failed to update transaction - no data returned');
            }
            
            console.log('Successfully updated transaction:', {
              id: updatedTransaction.id,
              merchant: updatedTransaction.merchant,
              mainCategoryId: updatedTransaction.main_category_id,
              subCategoryId: updatedTransaction.sub_category_id
            });
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

      // Refresh the transactions list
      await fetchTransactions();
      // Notify other components that transactions have been updated
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

  const createTransaction = async (data: TransactionFormData): Promise<Transaction | null> => {
    if (!user) return null;

    try {
      setLoading(true);
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

  // Ensure fetchTransactions is called when timeRange changes
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
