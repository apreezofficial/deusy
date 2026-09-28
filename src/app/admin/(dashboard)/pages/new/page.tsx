import Link from "next/link";
import { getAllMedia } from "@/lib/queries/admin";
import { PageForm } from "@/components/admin/PageForm";

export const dynamic = "force-dynamic";

export default async function NewAdminPage() {
  const media = await getAllMedia();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <Link
          href="/admin/pages"
          className="drawing-label text-sm underline decoration-signal decoration-2 underline-offset-4"
        >
          All pages
        </Link>
        <h1 className="display mt-3 text-4xl">New page</h1>
        <p className="mt-2 max-w-prose text-ink-muted">
          Write the page, choose whether it appears in the navigation, then publish
          it when it is ready for visitors.
        </p>
      </header>

      <PageForm page={null} media={media} />
    </div>
  );
}
