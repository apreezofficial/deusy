"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const storageKey = "deusy-cookie-choice";

/**
 * Small, dismissible cookie box. The choice is kept in local storage, so the box
 * does not come back on every page and nothing is sent anywhere.
 */
export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(window.localStorage.getItem(storageKey) === null);
    } catch {
      setVisible(false);
    }
  }, []);

  const choose = (choice: "accepted" | "essential") => {
    try {
      window.localStorage.setItem(storageKey, choice);
    } catch {
      // A blocked storage area only means the box returns on the next visit.
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Cookie notice"
      className="edge fixed inset-x-3 bottom-3 z-30 border-2 border-ink bg-paper p-4 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:max-w-sm sm:p-5"
    >
      <p className="drawing-label text-sm text-signal-dark">Cookies</p>
      <p className="mt-2 text-sm leading-relaxed">
        This site uses one essential cookie to keep you signed in to the admin panel. No
        tracking or advertising cookies are used.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => choose("accepted")}
          className="border-2 border-ink bg-signal px-4 py-2 text-sm font-medium shadow-[3px_3px_0_0_var(--color-ink)] transition-transform active:translate-[3px_3px] active:shadow-none"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => choose("essential")}
          className="border-2 border-ink bg-paper px-4 py-2 text-sm font-medium transition-colors hover:bg-tracing"
        >
          Essential only
        </button>
        <Link
          href="/cookie-policy"
          className="text-sm underline decoration-signal decoration-2 underline-offset-4"
        >
          Cookie policy
        </Link>
      </div>
    </aside>
  );
}
