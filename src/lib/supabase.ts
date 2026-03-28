import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rlmkzqygmjuqaechlixf.supabase.co";
const supabaseAnonKey = "sb_publishable_Cx4Kfarc-0XgMuJraybQhg_4OSxkdP0";

/**
 * SINGLETON SUPABASE CLIENT
 * Critical configuration for session persistence:
 * - persistSession: true (stores session in localStorage)
 * - autoRefreshToken: true (automatically refreshes expired tokens)
 * - detectSessionInUrl: false (we handle auth internally, not via URL params)
 * - storageKey: unique key to prevent conflicts
 * - flowType: implicit (NOT pkce - pkce can cause session drops during navigation)
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
      flowType: "implicit", // Changed from "pkce" to prevent session drops
    },
  }
);