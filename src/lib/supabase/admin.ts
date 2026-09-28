import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { requireSupabaseEnv, requireSecretKey } from "@/lib/supabase/env";

/**
 * Service-role client. Bypasses RLS, so it must only be used for operations
 * RLS genuinely cannot cover: user invites and profile bootstrapping.
 */
export function createAdminClient() {
  requireSupabaseEnv();

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    requireSecretKey(),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
