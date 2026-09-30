import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";

/**
 * Browser client. The key is read here rather than through the server-only env
 * helpers because this module also runs in the browser: current projects use a
 * publishable key (sb_publishable_...), older ones the anon key.
 */
export function createClient() {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    "";

  return createBrowserClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL as string, key);
}
