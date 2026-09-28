"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { WordmarkLink } from "@/components/site/Wordmark";
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

  const links = navPages.map((page) => ({
    href: `/${page.slug}`,
    label: page.nav_label?.trim() || page.title,
  }));

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <WordmarkLink name={site.name} logoUrl={site.logoUrl} />

        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
          <NavLink href="/#services">Services</NavLink>
          {links.map((link) => (
            <NavLink key={link.href} href={link.href} active={pathname === link.href}>
              {link.label}
            </NavLink>
          ))}
          <Link href="/contact" className={buttonStyles("primary", "sm")}>
            Request a consultation
          </Link>
        </nav>

        <button
          type="button"
          className="border-2 border-ink p-2 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-t-2 border-ink bg-paper md:hidden"
        >
          <div className="flex flex-col px-4 py-2">
            <MobileLink href="/#services" onClick={() => setOpen(false)}>
              Services
            </MobileLink>
            {links.map((link) => (
              <MobileLink key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </MobileLink>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-3 mb-2 inline-flex justify-center bg-signal px-5 py-3 font-medium text-ink"
            >
              Request a consultation
            </Link>
          </div>
        </nav>
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

function MobileLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="border-b-2 border-ink/15 py-3 last:border-b-0"
    >
      {children}
    </Link>
  );
}
