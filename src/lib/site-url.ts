import "server-only";

import { headers } from "next/headers";

/**
 * Resolves the public origin. Uses NEXT_PUBLIC_SITE_URL when it is set, and
 * otherwise the host of the incoming request, so no domain is ever guessed.
 */
export async function getBaseUrl(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
  if (configured) return configured;

  const requestHeaders = await headers();
  const host = requestHeaders.get("host");
  if (!host) return "http://localhost:3000";

  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  return `${protocol}://${host}`;
}
