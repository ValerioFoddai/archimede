import { supabase } from './supabase';

export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('user_tags').select('count');
    if (error) {
      console.error('❌ Supabase connection failed:', {
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return false;
    }
    console.info('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return false;
  }
}