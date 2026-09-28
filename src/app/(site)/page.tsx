import type { Metadata } from "next";
import Link from "next/link";
import { getHomeSettings, getServices, getSiteSettings } from "@/lib/queries/content";
import { PlanDrawing } from "@/components/site/PlanDrawing";
import { JsonLd } from "@/components/site/JsonLd";
import { buttonStyles } from "@/components/ui/Button";
import type { ServiceRow } from "@/lib/database.types";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [home, site] = await Promise.all([getHomeSettings(), getSiteSettings()]);
  const description = home.heroIntro || site.tagline;

  return {
    title: site.name,
    description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      title: site.name,
      description,
      siteName: site.name,
    },
  };
}

export default async function HomePage() {
  const [home, site, practices, agency] = await Promise.all([
    getHomeSettings(),
    getSiteSettings(),
    getServices("practice"),
    getServices("agency"),
  ]);

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    slogan: site.tagline,
    ...(site.email ? { email: site.email } : {}),
    ...(site.phone ? { telephone: site.phone } : {}),
    ...(site.addressLines.length > 0
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: site.addressLines[0],
            addressCountry: "GH",
          },
        }
      : {}),
  };

  return (
    <>
      <JsonLd data={organization} />

      <section className="border-b-2 border-ink">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="grid-plan border-b-2 border-ink px-4 py-14 sm:px-6 sm:py-20 lg:border-b-0 lg:border-r-2">
            <p className="tick drawing-label text-sm text-signal-dark">
              {site.tagline}
            </p>
            <h1 className="display mt-6 text-[clamp(2.5rem,1.5rem+4.5vw,4.5rem)]">
              {home.heroTitle || site.tagline}
            </h1>
            <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-ink-soft">
              {home.heroIntro}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/contact" className={buttonStyles("primary", "lg")}>
                Request a consultation
              </Link>
              <Link href="/#services" className={buttonStyles("outline", "lg")}>
                See our services
              </Link>
            </div>
          </div>

          <div className="relative min-h-64 bg-tracing px-4 py-10 sm:min-h-80 sm:px-6">
            <PlanDrawing />
          </div>
        </div>
      </section>

      <TitleBlock />

      <section id="services" className="border-b-2 border-ink px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="display text-[clamp(1.9rem,1.2rem+2.6vw,3rem)]">
            {home.servicesHeading}
          </h2>
          <ServiceList services={practices} />
        </div>
      </section>

      <section className="grid-plan-blue border-b-2 border-ink bg-tracing px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="display max-w-3xl text-[clamp(1.9rem,1.2rem+2.6vw,3rem)]">
            {home.agencyHeading}
          </h2>
          <ServiceList services={agency} />
        </div>
      </section>

      <section className="bg-signal px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="display text-[clamp(2rem,1.2rem+3vw,3.25rem)]">
            {home.closingHeading}
          </h2>
          <p className="mt-4 max-w-[58ch] text-lg text-ink">
            Send us the detail and the team will pick it up from there.
          </p>
          <Link
            href="/contact"
            className={`${buttonStyles("ink", "lg")} mt-8`}
          >
            Request a consultation
          </Link>
        </div>
      </section>
    </>
  );
}

async function TitleBlock() {
  const [site, services] = await Promise.all([getSiteSettings(), getServices()]);

  return (
    <section className="border-b-2 border-ink bg-ink text-paper">
      <dl className="mx-auto grid max-w-6xl sm:grid-cols-2 lg:grid-cols-4">
        <div className="border-b-2 border-paper/20 px-4 py-6 sm:border-r-2 sm:px-6 lg:border-b-0">
          <dt className="drawing-label text-sm text-drafting">Practice</dt>
          <dd className="display mt-2 text-xl">{site.name}</dd>
        </div>
        <div className="border-b-2 border-paper/20 px-4 py-6 sm:border-r-2 sm:px-6 lg:border-b-0">
          <dt className="drawing-label text-sm text-drafting">Areas of work</dt>
          <dd className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {services.length > 0 ? (
              services.map((service) => (
                <span key={service.id}>{service.title}</span>
              ))
            ) : (
              <span className="text-drafting">Available from the admin panel.</span>
            )}
          </dd>
        </div>
        <div className="border-b-2 border-paper/20 px-4 py-6 sm:border-r-2 sm:px-6 lg:border-b-0">
          <dt className="drawing-label text-sm text-drafting">Office</dt>
          <dd className="mt-2">
            {site.addressLines.length > 0 ? (
              site.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))
            ) : (
              <span className="text-drafting">Add an address in Settings.</span>
            )}
          </dd>
        </div>
        <div className="px-4 py-6 sm:px-6">
          <dt className="drawing-label text-sm text-drafting">Contact</dt>
          <dd className="mt-2 flex flex-col gap-1">
            {site.email ? (
              <a href={`mailto:${site.email}`} className="underline decoration-signal decoration-2 underline-offset-4">
                {site.email}
              </a>
            ) : null}
            {site.phone ? (
              <a href={`tel:${site.phone.replace(/\s+/g, "")}`} className="underline decoration-signal decoration-2 underline-offset-4">
                {site.phone}
              </a>
            ) : null}
            {!site.email && !site.phone ? (
              <Link
                href="/contact"
                className="underline decoration-signal decoration-2 underline-offset-4"
              >
                Use the contact form
              </Link>
            ) : null}
          </dd>
        </div>
      </dl>
    </section>
  );
}

function ServiceList({ services }: { services: ServiceRow[] }) {
  if (services.length === 0) {
    return (
      <p className="mt-8 border-2 border-dashed border-current p-6">
        No services yet. Add the first one from the admin panel.
      </p>
    );
  }

  return (
    <ul className="mt-10 grid gap-px border-2 border-ink bg-ink md:grid-cols-2">
      {services.map((service) => (
        <li key={service.id} className="bg-paper p-6 sm:p-8">
          <h3 className="display text-2xl">{service.title}</h3>
          <p className="mt-3 max-w-[58ch] leading-relaxed text-ink-soft">
            {service.summary}
          </p>
          {service.scope.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-2 text-sm text-ink-muted">
              {service.scope.map((item) => (
                <li key={item} className="border-2 border-ink px-2 py-0.5">
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
          <Link
            href={`/services/${service.slug}`}
            className="mt-6 inline-flex items-center gap-2 border-b-2 border-ink pb-0.5 hover:border-signal"
          >
            {service.title} details
          </Link>
        </li>
      ))}
    </ul>
  );
}
