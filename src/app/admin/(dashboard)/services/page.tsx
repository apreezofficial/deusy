import Link from "next/link";
import { getAllMedia, getAllServices } from "@/lib/queries/admin";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import type { ServiceRow } from "@/lib/database.types";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const [services, media] = await Promise.all([getAllServices(), getAllMedia()]);
  const practices = services.filter((service) => service.kind === "practice");
  const agency = services.filter((service) => service.kind === "agency");

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="display text-4xl">Services</h1>
        <p className="mt-2 max-w-prose text-ink-muted">
          The practices and agency services shown on the home page and at their own
          addresses.
        </p>
      </header>

      <Group
        title="Practices"
        description="The three core practices: construction and real estate, human resources, and consultancy."
        services={practices}
      />

      <Group
        title="Agency services"
        description="Property and automobile agency work."
        services={agency}
      />

      <section>
        <h2 className="display text-2xl">Add a service</h2>
        <p className="mt-2 text-ink-muted">
          New services appear as soon as they are saved and active.
        </p>
        <div className="mt-5">
          <ServiceForm service={null} media={media} />
        </div>
      </section>
    </div>
  );
}

function Group({
  title,
  description,
  services,
}: {
  title: string;
  description: string;
  services: ServiceRow[];
}) {
  return (
    <section>
      <h2 className="drawing-label text-lg">{title}</h2>
      <p className="mt-1 text-sm text-ink-muted">{description}</p>

      <div className="mt-4">
        {services.length === 0 ? (
          <EmptyState
            title={`No ${title.toLowerCase()} yet.`}
            description="Add the first one with the form below."
          />
        ) : (
          <Table>
            <THead>
              <TH>Title</TH>
              <TH>Slug</TH>
              <TH>Scope</TH>
              <TH>Order</TH>
              <TH>Status</TH>
              <TH>
                <span className="sr-only">Actions</span>
              </TH>
            </THead>
            <TBody>
              {services.map((service) => (
                <TR key={service.id}>
                  <TD className="font-medium">{service.title}</TD>
                  <TD className="text-ink-muted">/services/{service.slug}</TD>
                  <TD>{service.scope.length}</TD>
                  <TD>{service.sort_order}</TD>
                  <TD>{service.active ? "Active" : "Hidden"}</TD>
                  <TD>
                    <Link
                      href={`/admin/services/${service.id}`}
                      className="underline decoration-signal decoration-2 underline-offset-4"
                    >
                      Edit
                    </Link>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </div>
    </section>
  );
}
