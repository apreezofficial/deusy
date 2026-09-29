import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { isSupabaseConfigured, publishableKey } from "@/lib/supabase/env";

/** How long a public read may take before the written content is used instead. */
const publicTimeoutMs = 4000;

/**
 * Cookie-free client for public reads. Reading cookies is not allowed inside
 * `unstable_cache`, and public content is readable by the anon role under RLS
 * anyway, so cached queries use this instead of the request-scoped client.
 *
 * Every call is given a short timeout. The pages are written in the frontend,
 * so a project that is slow or unreachable must never hold a page open: the
 * query falls back to the written content instead.
 *
 * Returns null when no project is connected, which lets the public site render
 * its content instead of failing during setup.
 */
export function createPublicClient() {
  if (!isSupabaseConfigured()) return null;

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    publishableKey(),
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input: RequestInfo | URL, init?: RequestInit) =>
          fetch(input, {
            ...init,
            signal: init?.signal ?? AbortSignal.timeout(publicTimeoutMs),
          }),
      },
    },
  );
}
