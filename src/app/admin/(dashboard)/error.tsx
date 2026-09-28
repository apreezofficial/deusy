"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      // Surfaces the underlying message in the terminal during development.
      window.dispatchEvent(new CustomEvent("admin-error"));
    }
  }, []);

  return (
    <div className="border-2 border-ink bg-paper p-8">
      <p className="drawing-label text-sm text-signal-dark">Error</p>
      <h1 className="display mt-3 text-3xl">The admin panel hit an error.</h1>
      <p className="mt-3 max-w-prose text-ink-muted">
        Nothing was changed. Try again, and if it keeps happening check the Supabase
        project and your connection.
      </p>
      <div className="mt-6">
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
