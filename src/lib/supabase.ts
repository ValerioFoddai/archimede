import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with debug logging
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'cache-control': 'no-cache'
    }
  }
});

// Add debug logging for database queries
supabase.from('user_bank_accounts').select('*').then(({ data, error }) => {
  console.log('Debug - Testing user_bank_accounts table access:', {
    success: !error,
    error: error?.message,
    count: data?.length
  });
});

supabase.from('banks').select('*').then(({ data, error }) => {
  console.log('Debug - Testing banks table access:', {
    success: !error,
    error: error?.message,
    count: data?.length
  });
});

// Add connection check utility
export async function checkSupabaseConnection() {
  try {
    const { error } = await supabase.from('user_tags').select('count');
    if (error) throw error;
    console.info('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return false;
  }
}
