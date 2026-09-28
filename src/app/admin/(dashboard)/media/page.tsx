import { getAllMedia } from "@/lib/queries/admin";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const media = await getAllMedia();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="display text-4xl">Media</h1>
        <p className="mt-2 max-w-prose text-ink-muted">
          Images used on the site. The same library feeds the editor, services, team
          members and settings.
        </p>
      </header>

      <MediaLibrary media={media} />
    </div>
  );
}
