import Link from "next/link";
import { getAllPages } from "@/lib/queries/admin";
import { buttonStyles } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminPagesPage() {
  const pages = await getAllPages();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="display text-4xl">Pages</h1>
          <p className="mt-2 text-ink-muted">
            Every page on the site. Published pages appear at their slug.
          </p>
        </div>
        <Link href="/admin/pages/new" className={buttonStyles("primary", "md")}>
          New page
        </Link>
      </header>

      {pages.length === 0 ? (
        <EmptyState
          title="No pages yet."
          description="Create About, FAQ or Contact and they will show up in the navigation."
          action={
            <Link href="/admin/pages/new" className={buttonStyles("primary", "md")}>
              New page
            </Link>
          }
        />
      ) : (
        <Table>
          <THead>
            <TH>Title</TH>
            <TH>Slug</TH>
            <TH>Template</TH>
            <TH>Status</TH>
            <TH>In navigation</TH>
            <TH>Last updated</TH>
          </THead>
          <TBody>
            {pages.map((page) => (
              <TR key={page.id}>
                <TD>
                  <Link
                    href={`/admin/pages/${page.id}`}
                    className="font-medium underline decoration-signal decoration-2 underline-offset-4"
                  >
                    {page.title}
                  </Link>
                </TD>
                <TD className="text-ink-muted">/{page.slug}</TD>
                <TD>{page.template === "standard" ? "Standard" : page.template === "faq" ? "FAQ" : "Contact"}</TD>
                <TD>
                  {page.published ? "Published" : "Draft"}
                </TD>
                <TD>{page.show_in_nav ? "Yes" : "No"}</TD>
                <TD className="whitespace-nowrap">{formatDate(page.updated_at)}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}
