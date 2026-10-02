// Client to communicate with the Vanilla PHP + SQLite Backend

export const PHP_API_BASE =
  process.env.NEXT_PUBLIC_PHP_API_URL || "http://localhost:8000";

interface ApiResponse<T> {
  ok?: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function fetchPhpApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T | null> {
  const url = `${PHP_API_BASE}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.headers || {}),
      },
      next: { revalidate: 0 }, // always fresh in Next.js server context or override per call
    });

    if (!res.ok) {
      console.warn(`[PHP API] HTTP ${res.status} on ${endpoint}`);
      return null;
    }

    const json = (await res.json()) as ApiResponse<T> | T;
    if (json && typeof json === "object" && "data" in json) {
      return (json as ApiResponse<T>).data ?? null;
    }
    return json as T;
  } catch (err) {
    // If PHP server is offline or unreachable, return null gracefully so callers can fall back
    console.warn(`[PHP API] Could not connect to ${url}:`, (err as Error).message);
    return null;
  }
}
