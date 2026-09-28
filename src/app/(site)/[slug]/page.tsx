import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  getActiveFaqs,
  getActiveTeam,
  getPageBySlug,
  getPublishedPage,
  getServices,
  getSiteSettings,
} from "@/lib/queries/content";
import { getActor } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { RichText } from "@/components/site/RichText";
import { FaqList } from "@/components/site/FaqList";
import { JsonLd } from "@/components/site/JsonLd";
import { DraftBanner } from "@/components/site/DraftBanner";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { buttonStyles } from "@/components/ui/Button";
import type { PageRow, TeamMemberRow } from "@/lib/database.types";

export const dynamic = "force-dynamic";

interface ResolvedPage {
  page: PageRow;
  isDraft: boolean;
}

async function resolvePage(slug: string): Promise<ResolvedPage | null> {
  const published = await getPublishedPage(slug);
  if (published) return { page: published, isDraft: false };

  if (!isSupabaseConfigured()) return null;

  const actor = await getActor();
  if (!actor) return null;

  const draft = await getPageBySlug(slug);
  return draft ? { page: draft, isDraft: true } : null;
}

function firstValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export async function generateMetadata({
  params,
}: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await resolvePage(slug);

  if (!resolved) return { title: "Page not found" };

  const { page } = resolved;
  const title = page.seo_title?.trim() || page.title;
  const description = page.seo_desc?.trim() || page.subtitle?.trim() || undefined;

  return {
    title,
    ...(description ? { description } : {}),
    alternates: { canonical: `/${page.slug}` },
    openGraph: {
      type: "article",
      title,
      ...(description ? { description } : {}),
      ...(page.og_image ? { images: [{ url: page.og_image }] } : {}),
    },
    // Drafts are visible to staff only and must never be indexed.
    ...(resolved.isDraft ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function PageRoute({
  params,
  searchParams,
}: PageProps<"/[slug]">) {
  const { slug } = await params;
  const query = await searchParams;
  const resolved = await resolvePage(slug);

  if (!resolved) notFound();

  const { page } = resolved;

  return (
    <>
      {resolved.isDraft ? <DraftBanner title={page.title} /> : null}
      {page.template === "faq" ? (
        <FaqTemplate page={page} />
      ) : page.template === "contact" ? (
        <ContactTemplate
          page={page}
          topic={firstValue(query.topic)}
          intent={firstValue(query.intent)}
        />
      ) : page.slug === "about" ? (
        <AboutTemplate page={page} />
      ) : (
        <StandardTemplate page={page} />
      )}
    </>
  );
}

function PageHeader({
  page,
  eyebrow,
  children,
}: {
  page: PageRow;
  eyebrow?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="grid-plan border-b-2 border-ink">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        {eyebrow ? (
          <p className="reveal drawing-label border-b-2 border-ink pb-2 text-sm text-signal-dark">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="display reveal reveal-1 mt-6 text-[clamp(2.25rem,1.4rem+3.5vw,3.75rem)]">
          {page.title}
        </h1>
        {page.subtitle ? (
          <p className="reveal reveal-2 mt-5 max-w-[60ch] text-lg text-ink-soft sm:text-xl">
            {page.subtitle}
          </p>
        ) : null}
        {children}
      </div>
    </header>
  );
}

function StandardTemplate({ page }: { page: PageRow }) {
  return (
    <>
      <PageHeader page={page} />
      <div className="px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <RichText doc={page.content} />
        </div>
      </div>
    </>
  );
}

async function AboutTemplate({ page }: { page: PageRow }) {
  const [site, services, team] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getActiveTeam(),
  ]);

  const practices = services.filter((service) => service.kind === "practice");
  const agency = services.filter((service) => service.kind === "agency");

  const facts = [
    { value: String(practices.length), label: "Practices" },
    { value: String(agency.length), label: "Agency services" },
    { value: String(team.length || "—"), label: "Leadership team" },
    { value: site.addressLines[0]?.split(",")[0]?.trim() || "Ghana", label: "Based in" },
  ];

  return (
    <>
      <PageHeader page={page} eyebrow="About the practice" />

      <div className="border-b-2 border-ink bg-tracing px-4 py-10 sm:px-6">
        <dl className="edge mx-auto grid max-w-6xl gap-px border-2 border-ink bg-ink sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className="reveal-edge bg-paper p-5 sm:p-6">
              <dt className="drawing-label text-sm text-signal-dark">{fact.label}</dt>
              <dd className="display mt-2 text-3xl leading-none sm:text-4xl">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-14">
          <div className="edge reveal border-2 border-ink bg-paper p-6 sm:p-9">
            <RichText doc={page.content} />
          </div>

          <aside className="flex flex-col gap-6">
            <div className="reveal-edge border-2 border-ink bg-ink p-6 text-paper">
              <h2 className="drawing-label text-drafting">What we do</h2>
              <ul className="mt-4 flex flex-col">
                {services.map((service) => (
                  <li key={service.id} className="border-t border-paper/20 first:border-t-0">
                    <Link
                      href={`/services/${service.slug}`}
                      className="flex items-baseline justify-between gap-3 py-3 transition-colors hover:text-signal"
                    >
                      <span className="font-medium">{service.title}</span>
                      <span aria-hidden="true" className="text-drafting">
                        {String(service.scope.length).padStart(2, "0")}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/services" className={`${buttonStyles("primary", "sm")} mt-6 w-full`}>
                All services
              </Link>
            </div>

            <div className="edge-sm reveal-edge border-2 border-ink bg-paper p-6">
              <h2 className="drawing-label text-sm text-signal-dark">Where we are</h2>
              {site.addressLines.length > 0 ? (
                <address className="mt-3 not-italic leading-relaxed">
                  {site.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              ) : (
                <p className="mt-3 text-ink-muted">The address is added in Settings.</p>
              )}
              <Link
                href="/contact?intent=consultation"
                className={`${buttonStyles("ink", "md")} mt-5 w-full`}
              >
                Talk to us
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {team.length > 0 ? <Leadership team={team} /> : null}

      <section className="bg-signal px-4 py-14 sm:px-6 sm:py-16">
        <div className="reveal mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="display max-w-2xl text-[clamp(1.9rem,1.2rem+2.4vw,2.75rem)]">
            {site.tagline}
          </h2>
          <Link
            href="/contact?intent=consultation"
            className={`${buttonStyles("ink", "lg")} shrink-0`}
          >
            Request a consultation
          </Link>
        </div>
      </section>
    </>
  );
}

function Leadership({ team }: { team: TeamMemberRow[] }) {
  return (
    <section className="border-t-2 border-ink px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionRule eyebrow="The people" title="Leadership" />
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function TeamCard({ member }: { member: TeamMemberRow }) {
  return (
    <li className="edge-sm reveal-edge bg-paper p-6 transition-transform duration-150 hover:-translate-y-1 hover:shadow-[7px_7px_0_0_var(--color-ink)]">
      {member.photo ? (
        <Image
          src={member.photo}
          alt={member.name}
          width={320}
          height={320}
          className="h-40 w-40 border-2 border-ink object-cover"
          unoptimized
        />
      ) : null}
      <h3 className="drawing-label mt-5 text-lg leading-tight">{member.name}</h3>
      <p className="mt-1 text-sm text-signal-dark">{member.role}</p>
      {member.bio ? (
        <p className="mt-3 leading-relaxed text-ink-soft">{member.bio}</p>
      ) : null}
    </li>
  );
}

function SectionRule({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="flex flex-col gap-3 border-b-2 border-ink pb-5 sm:flex-row sm:items-end sm:justify-between">
      <h2 className="display text-[clamp(1.9rem,1.2rem+2.4vw,2.75rem)]">{title}</h2>
      <p className="drawing-label shrink-0 text-sm text-signal-dark">{eyebrow}</p>
    </div>
  );
}

async function FaqTemplate({ page }: { page: PageRow }) {
  const faqs = await getActiveFaqs();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader page={page} eyebrow="Answers" />
      <div className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-14">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="reveal">
              <RichText doc={page.content} />
            </div>
            <div className="edge reveal-edge mt-8 border-2 border-ink bg-ink p-6 text-paper">
              <h2 className="drawing-label text-drafting">Still have a question?</h2>
              <p className="mt-3 leading-relaxed text-paper/80">
                Ask it directly. A consultant reads every message and answers it
                personally.
              </p>
              <Link
                href="/contact?intent=consultation"
                className={`${buttonStyles("primary", "md")} mt-5 w-full`}
              >
                Ask a question
              </Link>
            </div>
          </aside>

          <div className="reveal reveal-1">
            <FaqList faqs={faqs} />
          </div>
        </div>
      </div>
    </>
  );
}

async function ContactTemplate({
  page,
  topic,
  intent,
}: {
  page: PageRow;
  topic?: string;
  intent?: string;
}) {
  const [site, services] = await Promise.all([getSiteSettings(), getServices()]);

  const topics = services.map((service) => service.title);
  const chosenTopic = topic && topics.includes(topic) ? topic : undefined;
  const isConsultation = intent === "consultation";

  const heading = chosenTopic
    ? `Ask about ${chosenTopic.toLowerCase()}`
    : isConsultation
      ? "Request a consultation"
      : "Send an enquiry";

  const note = chosenTopic
    ? `You came from the ${chosenTopic} page, so that topic is already selected. Change it below if that is not what you need.`
    : isConsultation
      ? "Tell us what you want to plan. A consultant reads every consultation request and comes back with the next step."
      : undefined;

  const details = [
    site.addressLines.length > 0
      ? { label: "Address", value: site.addressLines.join(", "), href: null }
      : null,
    site.phone ? { label: "Phone", value: site.phone, href: `tel:${site.phone.replace(/\s+/g, "")}` } : null,
    site.email ? { label: "Email", value: site.email, href: `mailto:${site.email}` } : null,
    site.whatsapp
      ? {
          label: "WhatsApp",
          value: site.whatsapp,
          href: `https://wa.me/${site.whatsapp.replace(/[^\d]/g, "")}`,
        }
      : null,
    site.hours ? { label: "Opening hours", value: site.hours, href: null } : null,
  ].filter((entry): entry is { label: string; value: string; href: string | null } =>
    entry !== null,
  );

  return (
    <>
      <PageHeader page={page} eyebrow="Contact" />
      <div className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-14">
          <div>
            <div className="reveal max-w-[62ch]">
              <RichText doc={page.content} />
            </div>

            {details.length > 0 ? (
              <dl className="reveal-edge mt-10 border-t-2 border-ink">
                {details.map((detail) => (
                  <div
                    key={detail.label}
                    className="flex flex-col gap-1 border-b-2 border-ink py-4 sm:flex-row sm:gap-6"
                  >
                    <dt className="drawing-label w-32 shrink-0 text-sm">{detail.label}</dt>
                    <dd className="break-words">
                      {detail.href ? (
                        <a href={detail.href} className="underline decoration-signal decoration-2 underline-offset-4">
                          {detail.value}
                        </a>
                      ) : (
                        detail.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="edge reveal-edge mt-10 border-2 border-dashed border-ink bg-paper p-6">
                Contact details have not been added yet. Send an enquiry below and we
                will pick it up.
              </p>
            )}
          </div>

          <div className="edge reveal reveal-1 self-start border-2 border-ink bg-paper p-6 sm:p-8">
            <p className="drawing-label text-sm text-signal-dark">Enquiry form</p>
            <h2 className="display mt-3 text-[clamp(1.6rem,1.2rem+1.4vw,2.25rem)]">
              {heading}
            </h2>
            <p className="mt-3 text-ink-muted">
              Tell us what you are planning. Every field marked required must be filled
              in.
            </p>
            <EnquiryForm topics={topics} defaultTopic={chosenTopic} note={note} />
          </div>
        </div>
      </div>
      <section className="border-t-2 border-ink bg-tracing px-4 py-12 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="display max-w-xl text-2xl">Not sure which service applies?</h2>
          <Link href="/services" className={`${buttonStyles("ink", "md")} shrink-0`}>
            See all services
          </Link>
        </div>
      </section>
    </>
  );
}
