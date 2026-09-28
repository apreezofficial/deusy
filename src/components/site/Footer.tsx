import Link from "next/link";
import { Wordmark } from "@/components/site/Wordmark";
import type { PageRow } from "@/lib/database.types";
import type { SiteSettings } from "@/lib/content/settings";

interface FooterProps {
  site: SiteSettings;
  navPages: PageRow[];
}

export function Footer({ site, navPages }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t-2 border-ink bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <Wordmark name={site.name} logoUrl={site.logoUrl} inverted />
          {site.tagline ? (
            <p className="mt-4 max-w-xs text-drafting">{site.tagline}</p>
          ) : null}
          {site.socials.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-4">
              {site.socials.map((social) => (
                <li key={social.url}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-signal decoration-2 underline-offset-4"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <nav aria-label="Footer">
          <h2 className="drawing-label text-sm text-drafting">Pages</h2>
          <ul className="mt-4 flex flex-col gap-2">
            <li>
              <Link href="/services" className="hover:text-signal">
                Services
              </Link>
            </li>
            {navPages.map((page) => (
              <li key={page.id}>
                <Link href={`/${page.slug}`} className="hover:text-signal">
                  {page.nav_label?.trim() || page.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="drawing-label text-sm text-drafting">Find us</h2>
          <address className="mt-4 flex flex-col gap-3 not-italic">
            {site.addressLines.length > 0 ? (
              <p>
                {site.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            ) : null}
            {site.phone ? (
              <p>
                <a href={`tel:${site.phone.replace(/\s+/g, "")}`} className="hover:text-signal">
                  {site.phone}
                </a>
              </p>
            ) : null}
            {site.email ? (
              <p>
                <a href={`mailto:${site.email}`} className="hover:text-signal">
                  {site.email}
                </a>
              </p>
            ) : null}
            {site.hours ? <p>{site.hours}</p> : null}
            {!site.addressLines.length &&
            !site.phone &&
            !site.email &&
            !site.hours ? (
              <p className="text-drafting">
                Contact details are published on the contact page.
              </p>
            ) : null}
          </address>
        </div>
      </div>

      <div className="border-t-2 border-paper/20">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-sm text-drafting sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p>{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
