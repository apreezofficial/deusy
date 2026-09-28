import type { Metadata } from "next";
import Link from "next/link";
import { getHomeSettings, getServices, getSiteSettings } from "@/lib/queries/content";
import { PlanDrawing } from "@/components/site/PlanDrawing";
import { JsonLd } from "@/components/site/JsonLd";
import { buttonStyles } from "@/components/ui/Button";
import type { ServiceRow } from "@/lib/database.types";
import type { SiteSettings } from "@/lib/content/settings";

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

  // The step list is optional content, so an older cached settings row without
  // it must not break the page.
  const processSteps = home.processSteps ?? [];

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
        <div className="grid lg:grid-cols-2">
          <div className="grid-plan order-2 border-t-2 border-ink px-4 py-14 sm:px-6 sm:py-20 lg:order-1 lg:border-r-2 lg:border-t-0">
            {site.tagline ? (
              <p className="drawing-label max-w-[40ch] border-b-2 border-ink pb-3 text-sm text-signal-dark">
                {site.tagline}
              </p>
            ) : null}
            <h1 className="display mt-6 text-[clamp(2.5rem,1.4rem+4.5vw,4.5rem)]">
              {home.heroTitle || site.tagline}
            </h1>
            <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-ink-soft">
              {home.heroIntro}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/contact?intent=consultation"
                className={buttonStyles("primary", "lg")}
              >
                Request a consultation
              </Link>
              <Link href="/services" className={buttonStyles("outline", "lg")}>
                See our services
              </Link>
            </div>
          </div>

          <div className="grid-plan-blue order-1 min-h-64 bg-tracing px-4 py-8 sm:min-h-80 sm:px-6 lg:order-2">
            <PlanDrawing />
          </div>
        </div>
      </section>

      <TitleBlock site={site} services={[...practices, ...agency]} />

      {processSteps.length > 0 ? (
        <section className="border-b-2 border-ink bg-tracing px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Process"
              title={home.processHeading}
              description={home.processIntro}
            />
            <ol className="mt-10 grid gap-px border-2 border-ink bg-ink sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step, index) => (
                <li
                  key={`${step.title}-${index}`}
                  className="reveal-edge flex flex-col bg-paper p-6"
                >
                  <span className="display text-4xl leading-none text-signal">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="drawing-label mt-4 text-lg leading-tight">{step.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-soft">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      <Audience />

      <section id="services" className="scroll-mt-24 border-b-2 border-ink px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="What we do"
            title={home.servicesHeading}
            action={
              <Link href="/services" className={buttonStyles("outline", "sm")}>
                All services
              </Link>
            }
          />
          <ServiceSchedule services={practices} kindLabel="Practice" />
        </div>
      </section>

      <section className="grid-plan-blue border-b-2 border-ink bg-tracing px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Agency services"
            title={home.agencyHeading}
            action={
              <Link href="/services#agency" className={buttonStyles("outline", "sm")}>
                All services
              </Link>
            }
          />
          <ServiceSchedule services={agency} kindLabel="Agency service" />
        </div>
      </section>

      <section className="bg-signal px-4 py-16 sm:px-6 sm:py-20">
        <div className="reveal mx-auto max-w-6xl">
          <h2 className="display max-w-3xl text-[clamp(2rem,1.2rem+3vw,3.25rem)]">
            {home.closingHeading}
          </h2>
          <p className="mt-4 max-w-[58ch] text-lg text-ink">
            Send us the detail and the team will pick it up from there.
          </p>
          <Link
            href="/contact?intent=consultation"
            className={`${buttonStyles("ink", "lg")} mt-8`}
          >
            Request a consultation
          </Link>
        </div>
      </section>
    </>
  );
}

function Audience() {
  const groups = [
    {
      title: "Individuals",
      text: "Buying, selling or renting property, sourcing a vehicle, or needing practical advice before signing anything.",
    },
    {
      title: "Businesses",
      text: "Construction and real estate projects, human resources support, compliance work, budgets and business planning.",
    },
    {
      title: "Institutions",
      text: "Organisations that need inspection readiness, workplace documentation, records in order and a working people function.",
    },
    {
      title: "Organisations and NGOs",
      text: "Advice on structure, funding, compliance and growth, delivered by people who have run both sides of the table.",
    },
  ];

  return (
    <section className="grid-plan-blue border-b-2 border-ink bg-paper px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Who we work with"
          title="Four kinds of client, one standard of work."
        />
        <ul className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {groups.map((group, index) => (
            <li
              key={group.title}
              className="edge-sm reveal-edge flex flex-col bg-paper p-6 transition-transform duration-150 hover:-translate-y-1 hover:shadow-[7px_7px_0_0_var(--color-ink)]"
            >
              <span aria-hidden="true" className="drawing-label text-sm text-signal-dark">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="display mt-3 text-2xl leading-tight">{group.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{group.text}</p>
            </li>
          ))}
        </ul>
        <p className="reveal mt-10 max-w-[62ch] border-2 border-ink bg-tracing p-6 leading-relaxed">
          Our values are integrity, professionalism, reliability, accountability,
          excellence and client satisfaction. They are not a poster on the wall: they are
          what decides how we handle your project and what we report back to you.
        </p>
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  action,
  description,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
  description?: string;
}) {
  return (
    <div className="reveal flex flex-col gap-4 border-b-2 border-ink pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <h2 className="display text-[clamp(1.9rem,1.2rem+2.6vw,3rem)]">{title}</h2>
        {description ? (
          <p className="mt-4 leading-relaxed text-ink-soft">{description}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-4">
        <p className="drawing-label text-sm text-signal-dark">{eyebrow}</p>
        {action}
      </div>
    </div>
  );
}

/**
 * The title block from a drawing sheet: a bordered card that sits clear of the
 * hero, with one cell per kind of information.
 */
function TitleBlock({
  site,
  services,
}: {
  site: SiteSettings;
  services: ServiceRow[];
}) {
  return (
    <section className="bg-paper px-4 py-12 sm:px-6 sm:py-16">
      <div className="edge mx-auto max-w-6xl border-2 border-ink bg-ink">
        <div className="grid gap-px bg-ink sm:grid-cols-2 lg:grid-cols-4">
          <div className="reveal-edge bg-paper p-5 sm:p-6">
            <p className="drawing-label text-sm text-signal-dark">Practice</p>
            <p className="display mt-3 text-2xl leading-tight">{site.name}</p>
            {site.tagline ? (
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{site.tagline}</p>
            ) : null}
          </div>

          <div className="reveal-edge bg-paper p-5 sm:p-6">
            <p className="drawing-label text-sm text-signal-dark">Areas of work</p>
            {services.length > 0 ? (
              <ul className="mt-3 flex flex-col gap-2">
                {services.map((service) => (
                  <li key={service.id}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-sm leading-snug underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:decoration-signal"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-ink-muted">
                Services are added from the admin panel.
              </p>
            )}
          </div>

          <div className="reveal-edge bg-paper p-5 sm:p-6">
            <p className="drawing-label text-sm text-signal-dark">Office</p>
            {site.addressLines.length > 0 ? (
              <address className="mt-3 not-italic text-sm leading-relaxed">
                {site.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            ) : (
              <p className="mt-3 text-sm text-ink-muted">
                Add an address in Settings.
              </p>
            )}
            {site.hours ? (
              <p className="mt-3 text-sm text-ink-muted">{site.hours}</p>
            ) : null}
          </div>

          <div className="reveal-edge flex flex-col justify-between gap-5 bg-paper p-5 sm:p-6">
            <div>
              <p className="drawing-label text-sm text-signal-dark">Contact</p>
              <ul className="mt-3 flex flex-col gap-1 text-sm">
                {site.email ? (
                  <li className="min-w-0">
                    <a
                      href={`mailto:${site.email}`}
                      className="block break-words underline decoration-signal decoration-2 underline-offset-4"
                    >
                      {site.email}
                    </a>
                  </li>
                ) : null}
                {site.phone ? (
                  <li>
                    <a
                      href={`tel:${site.phone.replace(/\s+/g, "")}`}
                      className="underline decoration-signal decoration-2 underline-offset-4"
                    >
                      {site.phone}
                    </a>
                  </li>
                ) : null}
                {!site.email && !site.phone ? (
                  <li className="text-ink-muted">
                    Phone and email are added in Settings.
                  </li>
                ) : null}
              </ul>
            </div>
            <Link
              href="/contact?intent=consultation"
              className={`${buttonStyles("primary", "sm")} w-full`}
            >
              Request a consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceSchedule({
  services,
  kindLabel,
}: {
  services: ServiceRow[];
  kindLabel: string;
}) {
  if (services.length === 0) {
    return (
      <p className="edge reveal mt-10 border-2 border-dashed border-ink bg-paper p-6">
        No services yet. Add the first one from the admin panel.
      </p>
    );
  }

  return (
    <ul className="edge mt-10 border-2 border-ink bg-paper">
      {services.map((service, index) => (
        <li key={service.id} className="border-b-2 border-ink last:border-b-0">
          <Link
            href={`/services/${service.slug}`}
            className="group flex flex-col gap-4 p-5 transition-colors hover:bg-tracing sm:p-7 lg:flex-row lg:items-start lg:gap-8"
          >
            <div className="flex items-baseline gap-4 lg:w-64 lg:shrink-0">
              <span aria-hidden="true" className="drawing-label text-xs text-signal-dark">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="drawing-label text-xs text-ink-muted">{kindLabel}</p>
                <h3 className="display mt-2 text-2xl leading-tight group-hover:underline group-hover:decoration-signal group-hover:decoration-[3px] group-hover:underline-offset-[6px] sm:text-[1.75rem]">
                  {service.title}
                </h3>
              </div>
            </div>

            <p className="max-w-[54ch] leading-relaxed text-ink-soft">
              {service.summary}
            </p>

            {service.scope.length > 0 ? (
              <ul className="flex flex-wrap gap-2 lg:w-56 lg:shrink-0 lg:justify-end">
                {service.scope.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 border-2 border-ink bg-paper px-2 py-1 text-xs"
                  >
                    <span aria-hidden="true" className="bullet-square" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
