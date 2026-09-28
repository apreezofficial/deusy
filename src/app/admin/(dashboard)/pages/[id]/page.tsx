import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllMedia, getPageById } from "@/lib/queries/admin";
import { PageForm } from "@/components/admin/PageForm";

export const dynamic = "force-dynamic";

export default async function EditAdminPage({ params }: PageProps<"/admin/pages/[id]">) {
  const { id } = await params;
  const [page, media] = await Promise.all([getPageById(id), getAllMedia()]);

  if (!page) notFound();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <Link
          href="/admin/pages"
          className="drawing-label text-sm underline decoration-signal decoration-2 underline-offset-4"
        >
          All pages
        </Link>
        <h1 className="display mt-3 text-4xl">{page.title}</h1>
        <p className="mt-2 text-ink-muted">
          {page.published
            ? `Published at /${page.slug}.`
            : `Draft. Visitors cannot see /${page.slug} until you publish it.`}
        </p>
      </header>

      <PageForm page={page} media={media} />
    </div>
  );
}
