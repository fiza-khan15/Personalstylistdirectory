import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rlmkzqygmjuqaechlixf.supabase.co";
const supabaseAnonKey = "sb_publishable_Cx4Kfarc-0XgMuJraybQhg_4OSxkdP0";

/**
 * SINGLETON SUPABASE CLIENT
 * Uses PKCE flow for maximum security
 * Relies entirely on Supabase's native session persistence
 */
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storageKey: "atelistry-auth",
      flowType: "pkce",
    },
  }
);