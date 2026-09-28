"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut, Menu, X } from "lucide-react";
import { Wordmark } from "@/components/site/Wordmark";
import { signOut } from "@/lib/actions/auth";

export interface AdminNavItem {
  href: string;
  label: string;
  badge?: number;
}

interface AdminShellProps {
  children: React.ReactNode;
  items: AdminNavItem[];
  userName: string;
  userRole: string;
}

export function AdminShell({ children, items, userName, userRole }: AdminShellProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const sidebar = (
    <div className="flex h-full flex-col bg-ink text-paper">
      <div className="border-b-2 border-paper/20 px-5 py-5">
        <Wordmark name="Deusy &amp; Planners Services" logoUrl="" inverted />
        <p className="mt-3 text-xs text-drafting">Admin panel</p>
      </div>

      <nav aria-label="Admin sections" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-1">
          {items.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center justify-between gap-2 border-2 px-3 py-2.5 text-sm transition-colors ${
                    active
                      ? "border-signal bg-signal text-ink font-medium"
                      : "border-transparent text-paper hover:border-drafting hover:bg-drafting/10"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge ? (
                    <span
                      className={`min-w-6 border-2 px-1.5 py-0.5 text-center text-xs ${
                        active
                          ? "border-ink"
                          : "border-signal bg-signal text-ink"
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t-2 border-paper/20 px-5 py-4 text-sm">
        <p className="font-medium">{userName}</p>
        <p className="text-xs text-drafting">{userRole === "admin" ? "Admin" : "Editor"}</p>
        <div className="mt-4 flex flex-col gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-2 border-paper/40 px-3 py-2 text-xs hover:border-drafting"
          >
            <ExternalLink size={14} aria-hidden="true" />
            View site
          </a>
          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex w-full items-center gap-2 border-2 border-paper/40 px-3 py-2 text-xs hover:border-signal hover:text-ink"
            >
              <LogOut size={14} aria-hidden="true" />
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-tracing">
      <div className="flex min-h-dvh">
        <aside className="hidden w-64 shrink-0 border-r-2 border-ink lg:block">
          <div className="sticky top-0 h-dvh">{sidebar}</div>
        </aside>

        {open ? (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="w-64 max-w-[80vw] border-r-2 border-ink">{sidebar}</div>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="flex-1 bg-ink/60"
            />
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between gap-4 border-b-2 border-ink bg-paper px-4 py-3 lg:hidden">
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              className="inline-flex items-center gap-2 border-2 border-ink px-3 py-2"
            >
              {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
              Menu
            </button>
            <span className="drawing-label text-sm">Admin panel</span>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
            <div className="mx-auto max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
