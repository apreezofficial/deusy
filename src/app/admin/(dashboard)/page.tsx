import Link from "next/link";
import { getDashboardStats, getAllPages } from "@/lib/queries/admin";
import { getEnquiries } from "@/lib/queries/content";
import { buttonStyles } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { StatusPill } from "@/components/admin/StatusPill";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [stats, pages, enquiries] = await Promise.all([
    getDashboardStats(),
    getAllPages(),
    getEnquiries("all"),
  ]);

  const latest = enquiries.slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="display text-4xl">Dashboard</h1>
        <p className="mt-2 text-ink-muted">
          Everything the site is showing right now, and what needs your attention.
        </p>
      </header>

      <div className="edge grid gap-px border-2 border-ink bg-ink sm:grid-cols-3">
        <Stat label="Published pages" value={stats.publishedPages} />
        <Stat label="Drafts waiting" value={stats.draftPages} />
        <Stat label="New enquiries" value={stats.newEnquiries} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/pages/new" className={buttonStyles("primary", "md")}>
          New page
        </Link>
        <Link href="/admin/faqs" className={buttonStyles("outline", "md")}>
          Add FAQ
        </Link>
        <Link href="/admin/enquiries" className={buttonStyles("outline", "md")}>
          Open enquiries
        </Link>
      </div>

      <section>
        <h2 className="drawing-label text-lg">Latest enquiries</h2>
        <div className="mt-4">
          {latest.length === 0 ? (
            <EmptyState
              title="No enquiries yet."
              description="Messages sent from the contact page land here."
            />
          ) : (
            <Table>
              <THead>
                <TH>From</TH>
                <TH>Topic</TH>
                <TH>Status</TH>
                <TH>Received</TH>
              </THead>
              <TBody>
                {latest.map((enquiry) => (
                  <TR key={enquiry.id}>
                    <TD>
                      <Link
                        href={`/admin/enquiries/${enquiry.id}`}
                        className="underline decoration-signal decoration-2 underline-offset-4"
                      >
                        {enquiry.name}
                      </Link>
                      <span className="block text-sm text-ink-muted">{enquiry.email}</span>
                    </TD>
                    <TD>{enquiry.topic ?? "Not given"}</TD>
                    <TD>
                      <StatusPill status={enquiry.status} />
                    </TD>
                    <TD className="whitespace-nowrap">{formatDate(enquiry.created_at)}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </div>
      </section>

      <section>
        <h2 className="drawing-label text-lg">Pages</h2>
        <div className="mt-4">
          {pages.length === 0 ? (
            <EmptyState
              title="No pages yet."
              description="Create About, FAQ or Contact and they will appear in the navigation."
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
                <TH>Status</TH>
                <TH>In navigation</TH>
                <TH>Last updated</TH>
              </THead>
              <TBody>
                {pages.slice(0, 5).map((page) => (
                  <TR key={page.id}>
                    <TD>
                      <Link
                        href={`/admin/pages/${page.id}`}
                        className="underline decoration-signal decoration-2 underline-offset-4"
                      >
                        {page.title}
                      </Link>
                      <span className="block text-sm text-ink-muted">/{page.slug}</span>
                    </TD>
                    <TD>{page.published ? "Published" : "Draft"}</TD>
                    <TD>{page.show_in_nav ? "Yes" : "No"}</TD>
                    <TD className="whitespace-nowrap">{formatDate(page.updated_at)}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-paper px-5 py-6">
      <p className="drawing-label text-4xl">{value}</p>
      <p className="mt-1 text-sm text-ink-muted">{label}</p>
    </div>
  );
}
