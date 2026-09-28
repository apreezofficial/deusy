import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getService, getServices } from "@/lib/queries/content";
import { RichText } from "@/components/site/RichText";
import { buttonStyles } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) return { title: "Service not found" };

  return {
    title: service.title,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      type: "article",
      title: service.title,
      description: service.summary,
      ...(service.image ? { images: [{ url: service.image }] } : {}),
    },
  };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) notFound();

  const related = (await getServices(service.kind)).filter(
    (item) => item.id !== service.id,
  );

  return (
    <>
      <header className="grid-plan border-b-2 border-ink px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <p className="drawing-label text-sm text-signal-dark">
            {service.kind === "practice" ? "Practice" : "Agency service"}
          </p>
          <h1 className="display mt-4 text-[clamp(2.25rem,1.4rem+3.5vw,3.75rem)]">
            {service.title}
          </h1>
          <p className="mt-5 max-w-[60ch] text-lg text-ink-soft">{service.summary}</p>
        </div>
      </header>

      <div className="px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div>
            {service.body ? <RichText doc={service.body} /> : null}
            {!service.body ? (
              <p className="max-w-[62ch] leading-relaxed text-ink-soft">
                {service.summary}
              </p>
            ) : null}

            {related.length > 0 ? (
              <section className="mt-14 border-t-2 border-ink pt-8">
                <h2 className="drawing-label text-sm text-ink-muted">
                  {service.kind === "practice" ? "Other practices" : "Other agency services"}
                </h2>
                <ul className="mt-4 flex flex-col">
                  {related.map((item) => (
                    <li key={item.id} className="border-b-2 border-ink">
                      <Link
                        href={`/services/${item.slug}`}
                        className="flex items-center justify-between gap-4 py-4 hover:text-signal-dark"
                      >
                        <span className="drawing-label text-lg">{item.title}</span>
                        <span aria-hidden="true" className="text-signal">
                          {item.scope.length} {item.scope.length === 1 ? "area" : "areas"}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <aside>
            {service.scope.length > 0 ? (
              <div className="border-2 border-ink p-6">
                <h2 className="drawing-label text-lg">What this covers</h2>
                <ul className="mt-4 flex flex-col gap-2">
                  {service.scope.map((item) => (
                    <li key={item} className="tick flex items-center pl-4">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {service.image ? (
              <Image
                src={service.image}
                alt={service.title}
                width={800}
                height={600}
                className="mt-6 w-full border-2 border-ink object-cover"
                unoptimized
              />
            ) : null}

            <Link
              href="/contact"
              className={`${buttonStyles("primary", "lg")} mt-6 w-full`}
            >
              Request a consultation
            </Link>
          </aside>
        </div>
      </div>
    </>
  );
}
