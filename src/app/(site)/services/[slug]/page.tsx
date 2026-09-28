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
      <header className="grid-plan border-b-2 border-ink px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="reveal drawing-label border-b-2 border-ink pb-2 text-sm text-signal-dark">
            {service.kind === "practice" ? "Practice" : "Agency service"}
          </p>
          <h1 className="display reveal reveal-1 mt-6 text-[clamp(2.25rem,1.4rem+3.5vw,3.75rem)]">
            {service.title}
          </h1>
          <p className="reveal reveal-2 mt-5 max-w-[60ch] text-lg text-ink-soft sm:text-xl">
            {service.summary}
          </p>
        </div>
      </header>

      <div className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-14">
          <div className="reveal">
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
                <Link
                  href="/services"
                  className={`${buttonStyles("outline", "sm")} mt-6`}
                >
                  All services
                </Link>
              </section>
            ) : null}
          </div>

          <aside className="reveal-edge self-start">
            {service.scope.length > 0 ? (
              <div className="edge border-2 border-ink bg-paper p-6">
                <h2 className="drawing-label text-lg">What this covers</h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {service.scope.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span aria-hidden="true" className="bullet-square" />
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

            <div className="edge mt-6 border-2 border-ink bg-ink p-6 text-paper">
              <h2 className="drawing-label text-drafting">Work with us on this</h2>
              <p className="mt-3 text-paper/80">
                Send the detail and a consultant comes back with the next step.
              </p>
              <Link
                href={`/contact?intent=consultation&topic=${encodeURIComponent(service.title)}`}
                className={`${buttonStyles("primary", "md")} mt-5 w-full`}
              >
                Request a consultation
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
