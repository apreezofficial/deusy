import type { Metadata } from "next";
import Link from "next/link";
import { getHomeSettings, getServices, getSiteSettings } from "@/lib/queries/content";
import { buttonStyles } from "@/components/ui/Button";
import type { ServiceRow } from "@/lib/database.types";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();

  return {
    title: "Services",
    description: site.tagline,
    alternates: { canonical: "/services" },
    openGraph: {
      type: "website",
      title: `Services | ${site.name}`,
      description: site.tagline,
    },
  };
}

export default async function ServicesPage() {
  const [home, services] = await Promise.all([getHomeSettings(), getServices()]);

  const practices = services.filter((service) => service.kind === "practice");
  const agency = services.filter((service) => service.kind === "agency");

  return (
    <>
      <header className="grid-plan border-b-2 border-ink">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="reveal drawing-label border-b-2 border-ink pb-2 text-sm text-signal-dark">
            Services
          </p>
          <h1 className="display reveal reveal-1 mt-6 text-[clamp(2.25rem,1.4rem+3.5vw,3.75rem)]">
            {home.servicesHeading || "What we do."}
          </h1>
          <p className="reveal reveal-2 mt-5 max-w-[60ch] text-lg text-ink-soft sm:text-xl">
            {home.heroIntro}
          </p>

          <nav aria-label="Service groups" className="reveal reveal-3 mt-8 flex flex-wrap gap-3">
            <a href="#practice" className={buttonStyles("outline", "sm")}>
              Practices ({practices.length})
            </a>
            <a href="#agency" className={buttonStyles("outline", "sm")}>
              Agency services ({agency.length})
            </a>
            <Link href="/contact?intent=consultation" className={buttonStyles("primary", "sm")}>
              Request a consultation
            </Link>
          </nav>
        </div>
      </header>

      <section id="practice" className="scroll-mt-24 border-b-2 border-ink px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <GroupHeading
            index="01"
            title="Practices"
            description="The work we do for organisations and individuals, delivered by our own team."
          />
          <ServiceGrid services={practices} />
        </div>
      </section>

      <section
        id="agency"
        className="grid-plan-blue scroll-mt-24 border-b-2 border-ink bg-tracing px-4 py-14 sm:px-6 sm:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <GroupHeading
            index="02"
            title="Agency services"
            description={home.agencyHeading}
          />
          <ServiceGrid services={agency} />
        </div>
      </section>

      <section className="bg-signal px-4 py-14 sm:px-6 sm:py-20">
        <div className="reveal mx-auto max-w-6xl">
          <h2 className="display max-w-3xl text-[clamp(1.9rem,1.2rem+2.6vw,3rem)]">
            {home.closingHeading}
          </h2>
          <p className="mt-4 max-w-[58ch] text-lg text-ink">
            Tell us which service applies and the team will take it from there.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact?intent=consultation" className={buttonStyles("ink", "lg")}>
              Request a consultation
            </Link>
            <Link
              href="/faq"
              className={`${buttonStyles("outline", "lg")} bg-signal hover:bg-paper`}
            >
              Read the FAQ
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function GroupHeading({
  index,
  title,
  description,
}: {
  index: string;
  title: string;
  description: string;
}) {
  return (
    <div className="reveal flex flex-col gap-3 border-b-2 border-ink pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-baseline gap-4">
        <span aria-hidden="true" className="drawing-label text-sm text-signal-dark">
          {index}
        </span>
        <h2 className="display text-[clamp(1.9rem,1.2rem+2.4vw,2.75rem)]">{title}</h2>
      </div>
      {description ? (
        <p className="max-w-[46ch] text-ink-soft sm:text-right">{description}</p>
      ) : null}
    </div>
  );
}

function ServiceGrid({ services }: { services: ServiceRow[] }) {
  if (services.length === 0) {
    return (
      <p className="edge mt-8 border-2 border-dashed border-ink bg-paper p-6">
        No services yet. Add the first one from the admin panel.
      </p>
    );
  }

  return (
    <ul className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {services.map((service, index) => (
        <li key={service.id} className="reveal-edge flex">
          <Link
            href={`/services/${service.slug}`}
            className="group flex w-full flex-col gap-4 border-2 border-ink bg-paper p-6 transition-[transform,box-shadow,background-color] duration-150 hover:-translate-y-1 hover:bg-tracing hover:shadow-[7px_7px_0_0_var(--color-ink)]"
          >
            <div className="flex items-start justify-between gap-4">
              <span aria-hidden="true" className="drawing-label text-sm text-signal-dark">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="drawing-label border-b-2 border-ink text-sm transition-colors group-hover:border-signal">
                Read more
              </span>
            </div>

            <h3 className="display text-2xl leading-tight">{service.title}</h3>

            <p className="leading-relaxed text-ink-soft">{service.summary}</p>

            {service.scope.length > 0 ? (
              <ul className="mt-auto flex flex-wrap gap-2 pt-2">
                {service.scope.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 border border-ink px-2 py-1 text-xs"
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
