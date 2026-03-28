import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rlmkzqygmjuqaechlixf.supabase.co";
const supabaseAnonKey = "sb_publishable_Cx4Kfarc-0XgMuJraybQhg_4OSxkdP0";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storageKey: "atelistry-auth",
      flowType: "pkce", // IMPORTANT
    },
  }
);