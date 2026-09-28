import "server-only";

function configured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  return !(
    url === "" ||
    anonKey === "" ||
    url.includes("placeholder") ||
    url.includes("your-project-ref") ||
    anonKey.includes("placeholder")
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
    "Supabase is not connected yet. Open .env.local, replace the placeholder values with your project URL and anon key from Supabase > Project settings > API, then restart the dev server.",
  );
}
