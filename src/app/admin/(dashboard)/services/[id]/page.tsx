import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllMedia, getServiceById } from "@/lib/queries/admin";
import { ServiceForm } from "@/components/admin/ServiceForm";

export const dynamic = "force-dynamic";

export default async function EditAdminService({
  params,
}: PageProps<"/admin/services/[id]">) {
  const { id } = await params;
  const [service, media] = await Promise.all([getServiceById(id), getAllMedia()]);

  if (!service) notFound();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <Link
          href="/admin/services"
          className="drawing-label text-sm underline decoration-signal decoration-2 underline-offset-4"
        >
          All services
        </Link>
        <h1 className="display mt-3 text-4xl">{service.title}</h1>
        <p className="mt-2 text-ink-muted">
          {service.active
            ? `Live at /services/${service.slug}.`
            : "Hidden from the site."}
        </p>
      </header>

      <ServiceForm service={service} media={media} />
    </div>
  );
}
