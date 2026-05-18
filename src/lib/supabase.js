import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase environment variables are missing. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the project root .env file."
  );
}

console.log("Supabase environment loaded:", {
  url: supabaseUrl,
  anonKeyLoaded: Boolean(supabaseAnonKey),
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
