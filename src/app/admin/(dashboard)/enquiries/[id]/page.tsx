import Link from "next/link";
import { notFound } from "next/navigation";
import { getEnquiry } from "@/lib/queries/content";
import { setEnquiryStatus } from "@/lib/actions/enquiry-status";
import { voidAction } from "@/lib/actions/form-action";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/admin/StatusPill";
import { DeleteEnquiryButton } from "@/components/admin/DeleteEnquiryButton";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminEnquiryPage({
  params,
}: PageProps<"/admin/enquiries/[id]">) {
  const { id } = await params;
  const enquiry = await getEnquiry(id);

  if (!enquiry) notFound();

  const fields = [
    { label: "Name", value: enquiry.name },
    { label: "Email", value: enquiry.email, href: `mailto:${enquiry.email}` },
    enquiry.phone
      ? {
          label: "Phone",
          value: enquiry.phone,
          href: `tel:${enquiry.phone.replace(/\s+/g, "")}`,
        }
      : null,
    { label: "Topic", value: enquiry.topic ?? "Not given" },
    { label: "Received", value: formatDateTime(enquiry.created_at) },
  ].filter((field): field is { label: string; value: string; href?: string } =>
    field !== null,
  );

  return (
    <div className="flex flex-col gap-6">
      <header>
        <Link
          href="/admin/enquiries"
          className="drawing-label text-sm underline decoration-signal decoration-2 underline-offset-4"
        >
          All enquiries
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <h1 className="display text-4xl">{enquiry.name}</h1>
          <StatusPill status={enquiry.status} />
        </div>
      </header>

      <dl className="edge-sm grid gap-px border-2 border-ink bg-ink sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.label} className="bg-paper px-4 py-3">
            <dt className="drawing-label text-sm">{field.label}</dt>
            <dd className="mt-1 break-words">
              {field.href ? (
                <a
                  href={field.href}
                  className="underline decoration-signal decoration-2 underline-offset-4"
                >
                  {field.value}
                </a>
              ) : (
                field.value
              )}
            </dd>
          </div>
        ))}
      </dl>

      <section>
        <h2 className="drawing-label text-lg">Message</h2>
        <p className="mt-3 max-w-[70ch] whitespace-pre-line border-2 border-ink bg-paper p-4 leading-relaxed">
          {enquiry.message}
        </p>
      </section>

      <div className="edge flex flex-wrap gap-3 border-2 border-ink bg-paper p-4">
        {enquiry.status === "new" ? (
          <form action={voidAction(setEnquiryStatus)}>
            <input type="hidden" name="id" value={enquiry.id} />
            <input type="hidden" name="status" value="read" />
            <Button type="submit" variant="outline">
              Mark as read
            </Button>
          </form>
        ) : null}

        {enquiry.status !== "archived" ? (
          <form action={voidAction(setEnquiryStatus)}>
            <input type="hidden" name="id" value={enquiry.id} />
            <input type="hidden" name="status" value="archived" />
            <Button type="submit" variant="outline">
              Archive
            </Button>
          </form>
        ) : (
          <form action={voidAction(setEnquiryStatus)}>
            <input type="hidden" name="id" value={enquiry.id} />
            <input type="hidden" name="status" value="read" />
            <Button type="submit" variant="outline">
              Unarchive
            </Button>
          </form>
        )}

        <a
          href={`mailto:${enquiry.email}?subject=Your enquiry to Deusy Investments Services`}
          className="inline-flex h-11 items-center border-2 border-ink px-5 hover:bg-tracing"
        >
          Reply by email
        </a>

        <span className="flex-1" />

        <DeleteEnquiryButton id={enquiry.id} name={enquiry.name} />
      </div>
    </div>
  );
}
