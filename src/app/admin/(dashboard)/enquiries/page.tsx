import Link from "next/link";
import { getEnquiries, type EnquiryFilter } from "@/lib/queries/content";
import { StatusPill } from "@/components/admin/StatusPill";
import { EmptyState } from "@/components/ui/EmptyState";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

const filters: { value: EnquiryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "read", label: "Read" },
  { value: "archived", label: "Archived" },
];

export default async function AdminEnquiriesPage({
  searchParams,
}: PageProps<"/admin/enquiries">) {
  const params = await searchParams;
  const requested = typeof params.status === "string" ? params.status : "all";
  const active = (filters.find((filter) => filter.value === requested)?.value ??
    "all") as EnquiryFilter;

  const enquiries = await getEnquiries(active);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="display text-4xl">Enquiries</h1>
        <p className="mt-2 max-w-prose text-ink-muted">
          Messages sent from the contact page.
        </p>
      </header>

      <nav aria-label="Filter enquiries" className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Link
            key={filter.value}
            href={filter.value === "all" ? "/admin/enquiries" : `/admin/enquiries?status=${filter.value}`}
            aria-current={active === filter.value ? "page" : undefined}
            className={`border-2 border-ink px-4 py-2 text-sm ${
              active === filter.value ? "bg-signal" : "bg-paper hover:bg-tracing"
            }`}
          >
            {filter.label}
          </Link>
        ))}
      </nav>

      {enquiries.length === 0 ? (
        <EmptyState
          title="No enquiries here."
          description="Messages sent from the contact page land in this list."
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
            {enquiries.map((enquiry) => (
              <TR key={enquiry.id} className={enquiry.status === "new" ? "bg-drafting/40" : ""}>
                <TD>
                  <Link
                    href={`/admin/enquiries/${enquiry.id}`}
                    className="font-medium underline decoration-signal decoration-2 underline-offset-4"
                  >
                    {enquiry.name}
                  </Link>
                  <span className="block text-sm text-ink-muted">{enquiry.email}</span>
                </TD>
                <TD>{enquiry.topic ?? "Not given"}</TD>
                <TD>
                  <StatusPill status={enquiry.status} />
                </TD>
                <TD className="whitespace-nowrap">{formatDateTime(enquiry.created_at)}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}
