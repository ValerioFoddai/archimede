import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Bank {
  id: string;
  name: string;
}

export function useBanks() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchBanks() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('banks')
          .select('*')
          .order('name');

        if (error) throw error;
        setBanks(data || []);
      } catch (err) {
        console.error('Error fetching banks:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch banks'));
      } finally {
        setLoading(false);
      }
    }

    fetchBanks();
  }, []);

  return { banks, loading, error };
}