import "server-only";

/**
 * Supabase renamed the browser key. The dashboard now offers a publishable key
 * (sb_publishable_...), and older projects use the anon key, so both are read.
 */
export function publishableKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    ""
  );
}

/**
 * The dashboard now issues a secret key (sb_secret_...); older projects call the
 * same credential the service role key. Either name is accepted, and both are
 * only ever read on the server.
 */
export function secretKey(): string {
  return process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
}

function configured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = publishableKey();

  return !(
    url === "" ||
    key === "" ||
    url.includes("placeholder") ||
    url.includes("your-project-ref") ||
    key.includes("placeholder")
  );
}

/** True once real project credentials are present. */
export function isSupabaseConfigured(): boolean {
  return configured();
}

/**
 * Fails with an actionable message instead of a bare "fetch failed" when the
 * project has not been pointed at a real Supabase project yet.
 */
export function requireSupabaseEnv(): void {
  if (configured()) return;

  throw new Error(
    "Supabase is not connected yet. Open .env.local, replace the placeholder values with your project URL and publishable key from Supabase > Project Settings > API Keys, then restart the dev server.",
  );
}

/** Fails clearly when staff-only actions run without the server-side key. */
export function requireSecretKey(): string {
  const key = secretKey();

  if (configured() && key !== "" && !key.includes("placeholder")) return key;

  throw new Error(
    "The Supabase server key is missing. Add SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY) to .env.local from Supabase > Project Settings > API Keys, then restart the dev server.",
  );
}
