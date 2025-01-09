import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { useToast } from './useToast';
import type { Budget, BudgetFormData } from '@/types/budgets';

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchBudgets = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get budgets
      const { data: budgetsData, error: budgetsError } = await supabase
        .from('user_budgets')
        .select('*')
        .eq('user_id', user.id);

      if (budgetsError) throw budgetsError;

      // Get transactions for spending calculations
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: transactions, error: transactionsError } = await supabase
        .from('user_transactions')
        .select('amount, main_category_id')
        .eq('user_id', user.id)
        .gte('date', startOfMonth.toISOString())
        .lt('amount', 0); // Only expenses

      if (transactionsError) throw transactionsError;

      // Calculate spending by category
      const categorySpending = transactions.reduce((acc, t) => {
        if (t.main_category_id) {
          acc[t.main_category_id] = (acc[t.main_category_id] || 0) + Math.abs(t.amount);
        }
        return acc;
      }, {} as Record<number, number>);

      // Transform budgets with spending data
      const transformedBudgets = budgetsData.map(budget => {
        const spent = categorySpending[budget.main_category_id] || 0;
        const remaining = budget.amount - spent;
        const percentageUsed = (spent / budget.amount) * 100;

        return {
          id: budget.id,
          mainCategoryId: budget.main_category_id,
          amount: budget.amount,
          recurring: budget.recurring,
          startDate: new Date(budget.start_date),
          endDate: budget.end_date ? new Date(budget.end_date) : undefined,
          spent,
          remaining,
          percentageUsed,
        };
      });

      setBudgets(transformedBudgets);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      toast({
        title: "Error",
        description: "Failed to fetch budgets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createBudget = async (data: BudgetFormData): Promise<Budget | null> => {
    if (!user) return null;

    try {
      const { data: budget, error } = await supabase
        .from('user_budgets')
        .insert([{
          user_id: user.id,
          main_category_id: data.mainCategoryId,
          amount: parseFloat(data.amount),
          recurring: data.recurring,
          start_date: data.startDate.toISOString(),
          end_date: data.endDate?.toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Budget created successfully",
      });

      await fetchBudgets();
      return budget;
    } catch (error) {
      console.error('Error creating budget:', error);
      toast({
        title: "Error",
        description: "Failed to create budget",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateBudget = async (id: string, data: BudgetFormData): Promise<Budget | null> => {
    if (!user) return null;

    try {
      const { error } = await supabase
        .from('user_budgets')
        .update({
          main_category_id: data.mainCategoryId,
          amount: parseFloat(data.amount),
          recurring: data.recurring,
          start_date: data.startDate.toISOString(),
          end_date: data.endDate?.toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Budget updated successfully",
      });

      await fetchBudgets();
      return budgets.find(b => b.id === id) || null;
    } catch (error) {
      console.error('Error updating budget:', error);
      toast({
        title: "Error",
        description: "Failed to update budget",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [user]);

  return {
    budgets,
    loading,
    createBudget,
    updateBudget,
    refresh: fetchBudgets,
  };
}