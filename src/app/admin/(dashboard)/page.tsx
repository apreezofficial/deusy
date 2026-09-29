import Link from "next/link";
import { getAllFaqs, getExtraPagesForAdmin } from "@/lib/queries/admin";
import { getEnquiries } from "@/lib/queries/content";
import { buttonStyles } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { StatusPill } from "@/components/admin/StatusPill";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [faqs, pages, enquiries] = await Promise.all([
    getAllFaqs(),
    getExtraPagesForAdmin(),
    getEnquiries("all"),
  ]);

  const latest = enquiries.slice(0, 5);
  const drafts = pages.filter((page) => !page.published).length;

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="display text-4xl">Dashboard</h1>
        <p className="mt-2 max-w-prose text-ink-muted">
          This panel manages the FAQ list and any extra pages. The rest of the site is
          written in the frontend.
        </p>
      </header>

      <div className="edge grid gap-px border-2 border-ink bg-ink sm:grid-cols-3">
        <Stat label="Questions listed" value={faqs.length} />
        <Stat label="Extra pages" value={pages.length} />
        <Stat label="New enquiries" value={enquiries.filter((e) => e.status === "new").length} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/faqs" className={buttonStyles("primary", "md")}>
          Manage FAQs
        </Link>
        <Link href="/admin/pages" className={buttonStyles("outline", "md")}>
          Extra pages
        </Link>
        <Link href="/admin/enquiries" className={buttonStyles("outline", "md")}>
          Open enquiries
        </Link>
      </div>

      {drafts > 0 ? (
        <p className="edge-sm border-2 border-ink bg-signal p-4 text-sm">
          {drafts} extra {drafts === 1 ? "page is" : "pages are"} still a draft. Drafts
          are not reachable from the site.
        </p>
      ) : null}

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
        <h2 className="drawing-label text-lg">Extra pages</h2>
        <div className="mt-4">
          {pages.length === 0 ? (
            <EmptyState
              title="No extra pages."
              description="Add a page here when you need something the frontend does not already cover."
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
                <TH>Last updated</TH>
              </THead>
              <TBody>
                {pages.map((page) => (
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
