import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rlmkzqygmjuqaechlixf.supabase.co';
const supabaseAnonKey = 'sb_publishable_Cx4Kfarc-0XgMuJraybQhg_4OSxkdP0';

let supabaseInstance: SupabaseClient | null = null;

export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        storageKey: 'atelistry-auth',
      },
    });
  }
  return supabaseInstance;
})();