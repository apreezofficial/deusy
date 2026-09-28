import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getNavPages, getSiteSettings } from "@/lib/queries/content";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [site, navPages] = await Promise.all([getSiteSettings(), getNavPages()]);

  return (
    <div className="flex min-h-full flex-col bg-paper">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <Header site={site} navPages={navPages} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer site={site} navPages={navPages} />
    </div>
  );
}
