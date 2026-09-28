import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { isSupabaseConfigured } from "@/lib/supabase/env";

/**
 * Cookie-free client for public reads. Reading cookies is not allowed inside
 * `unstable_cache`, and public content is readable by the anon role under RLS
 * anyway, so cached queries use this instead of the request-scoped client.
 *
 * Returns null when no project is connected, which lets the public site render
 * its seed content instead of failing during setup.
 */
export function createPublicClient() {
  if (!isSupabaseConfigured()) return null;

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}
