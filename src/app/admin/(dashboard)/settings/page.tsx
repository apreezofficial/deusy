import { getHomeSettings, getSiteSettings } from "@/lib/queries/content";
import { getAllMedia } from "@/lib/queries/admin";
import { SettingsPanel } from "@/components/admin/SettingsPanel";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [site, home, media] = await Promise.all([
    getSiteSettings(),
    getHomeSettings(),
    getAllMedia(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="display text-4xl">Settings</h1>
        <p className="mt-2 max-w-prose text-ink-muted">
          Business details used across the site, and the words on the home page.
          Anything left empty is hidden rather than shown blank.
        </p>
      </header>

      <SettingsPanel site={site} home={home} media={media} />
    </div>
  );
}
