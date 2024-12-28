import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { MainCategory } from '@/types/expense-categories';

export function useExpenseCategories() {
  const [categories, setCategories] = useState<MainCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data: mainCategories, error: mainError } = await supabase
          .from('main_expense_categories')
          .select('*')
          .order('id');

        if (mainError) throw mainError;

        const { data: subCategories, error: subError } = await supabase
          .from('sub_expense_categories')
          .select('*')
          .order('id');

        if (subError) throw subError;

        const categoriesWithSubs = mainCategories.map(main => ({
          ...main,
          sub_categories: subCategories.filter(sub => sub.main_category_id === main.id)
        }));

        setCategories(categoriesWithSubs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return { categories, loading, error };
}