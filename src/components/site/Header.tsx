"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Wordmark, WordmarkLink } from "@/components/site/Wordmark";
import { buttonStyles } from "@/components/ui/Button";
import type { PageRow } from "@/lib/database.types";
import type { SiteSettings } from "@/lib/content/settings";

interface HeaderProps {
  site: SiteSettings;
  navPages: PageRow[];
}

export function Header({ site, navPages }: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/services", label: "Services" },
    ...navPages.map((page) => ({
      href: `/${page.slug}`,
      label: page.nav_label?.trim() || page.title,
    })),
  ];

  // The popup covers the page, so the page behind it must not scroll.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <WordmarkLink name={site.name} logoUrl={site.logoUrl} />

        <nav aria-label="Main" className="hidden items-center gap-5 lg:flex xl:gap-6">
          {links.map((link) => (
            <NavLink key={link.href} href={link.href} active={pathname === link.href}>
              {link.label}
            </NavLink>
          ))}
          <Link
            href="/contact?intent=consultation"
            className={buttonStyles("primary", "sm")}
          >
            Request a consultation
          </Link>
        </nav>

        <button
          type="button"
          className="edge-press flex items-center gap-2 border-2 border-ink px-3 py-2 text-sm font-medium shadow-[3px_3px_0_0_var(--color-ink)] lg:hidden"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen(true)}
        >
          <Menu size={18} aria-hidden="true" />
          Menu
        </button>
      </div>

      {open ? (
        <div
          id="site-menu"
          className="menu-popup fixed inset-0 z-50 flex flex-col overflow-y-auto bg-paper lg:hidden"
        >
          <div className="flex items-center justify-between gap-4 border-b-2 border-ink px-4 py-3 sm:px-6">
            <WordmarkLink
              name={site.name}
              logoUrl={site.logoUrl}
              onClick={() => setOpen(false)}
            />
            <button
              type="button"
              className="edge-press flex items-center gap-2 border-2 border-ink px-3 py-2 text-sm font-medium shadow-[3px_3px_0_0_var(--color-ink)]"
              onClick={() => setOpen(false)}
            >
              <X size={18} aria-hidden="true" />
              Close
            </button>
          </div>

          <nav aria-label="Site" className="flex-1 px-4 py-6 sm:px-6">
            <ul className="flex flex-col">
              {links.map((link, index) => (
                <li key={link.href} className="border-b-2 border-ink">
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={pathname === link.href ? "page" : undefined}
                    className="flex items-baseline gap-4 py-4 transition-colors hover:text-signal-dark sm:py-5"
                  >
                    <span
                      aria-hidden="true"
                      className="drawing-label text-sm text-signal-dark"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="display text-3xl sm:text-4xl">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="/contact?intent=consultation"
              onClick={() => setOpen(false)}
              className={`${buttonStyles("primary", "lg")} mt-8 w-full`}
            >
              Request a consultation
            </Link>
          </nav>

          <div className="border-t-2 border-ink bg-tracing px-4 py-5 sm:px-6">
            <Wordmark name={site.name} logoUrl={site.logoUrl} className="hidden" />
            <address className="not-italic text-sm leading-relaxed">
              {site.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              {site.email ? (
                <a
                  href={`mailto:${site.email}`}
                  className="mt-1 block break-words underline decoration-signal decoration-2 underline-offset-4"
                >
                  {site.email}
                </a>
              ) : null}
              {site.phone ? (
                <a
                  href={`tel:${site.phone.replace(/\s+/g, "")}`}
                  className="mt-1 block underline decoration-signal decoration-2 underline-offset-4"
                >
                  {site.phone}
                </a>
              ) : null}
            </address>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function NavLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`border-b-2 py-1 transition-colors hover:border-signal ${
        active ? "border-signal" : "border-transparent"
      }`}
    >
      {children}
    </Link>
  );
}
