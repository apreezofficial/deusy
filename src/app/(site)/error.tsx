"use client";

import { Button } from "@/components/ui/Button";

export default function SiteError({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <p className="drawing-label text-sm text-signal-dark">Error 500</p>
      <h1 className="display mt-4 text-[clamp(2.25rem,1.5rem+3.5vw,3.5rem)]">
        Something went wrong on our side.
      </h1>
      <p className="mt-5 max-w-[58ch] text-lg text-ink-soft">
        The page could not be loaded. Try again, and if it keeps failing use the
        contact page to tell us what you were trying to reach.
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
