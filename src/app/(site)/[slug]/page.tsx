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

export default async function PageRoute({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const resolved = await resolvePage(slug);

  if (!resolved) notFound();

  return (
    <>
      {resolved.isDraft ? <DraftBanner title={resolved.page.title} /> : null}
      {resolved.page.template === "faq" ? (
        <FaqTemplate page={resolved.page} />
      ) : resolved.page.template === "contact" ? (
        <ContactTemplate page={resolved.page} />
      ) : (
        <StandardTemplate page={resolved.page} />
      )}
    </>
  );
}

function PageHeader({ page }: { page: PageRow }) {
  return (
    <header className="grid-plan border-b-2 border-ink px-4 py-14 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="display text-[clamp(2.25rem,1.4rem+3.5vw,3.75rem)]">
          {page.title}
        </h1>
        {page.subtitle ? (
          <p className="mt-4 max-w-[60ch] text-lg text-ink-soft">{page.subtitle}</p>
        ) : null}
      </div>
    </header>
  );
}

function StandardTemplate({ page }: { page: PageRow }) {
  return (
    <>
      <PageHeader page={page} />
      <div className="px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <RichText doc={page.content} />
          {page.slug === "about" ? <Leadership /> : null}
        </div>
      </div>
    </>
  );
}

async function Leadership() {
  const team = await getActiveTeam();
  if (team.length === 0) return null;

  return (
    <section className="mt-16 border-t-2 border-ink pt-10">
      <h2 className="display text-3xl">Leadership</h2>
      <ul className="edge mt-8 grid gap-px border-2 border-ink bg-ink sm:grid-cols-2">
        {team.map((member) => (
          <TeamCard key={member.id} member={member} />
        ))}
      </ul>
    </section>
  );
}

function TeamCard({ member }: { member: TeamMemberRow }) {
  return (
    <li className="bg-paper p-6">
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
      <h3 className="drawing-label mt-4 text-lg">{member.name}</h3>
      <p className="text-sm text-ink-muted">{member.role}</p>
      {member.bio ? (
        <p className="mt-3 max-w-[55ch] leading-relaxed text-ink-soft">{member.bio}</p>
      ) : null}
    </li>
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
      <PageHeader page={page} />
      <div className="px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <RichText doc={page.content} />
          <div className="mt-10">
            <FaqList faqs={faqs} />
          </div>
        </div>
      </div>
    </>
  );
}

async function ContactTemplate({ page }: { page: PageRow }) {
  const [site, services] = await Promise.all([getSiteSettings(), getServices()]);

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
      <PageHeader page={page} />
      <div className="px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div>
            <RichText doc={page.content} />

            {details.length > 0 ? (
              <dl className="mt-10 border-t-2 border-ink">
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
              <p className="mt-10 edge border-2 border-dashed border-ink bg-paper p-6">
                Contact details have not been added yet. Send an enquiry below and we
                will pick it up.
              </p>
            )}
          </div>

          <div className="edge border-2 border-ink bg-paper p-6 sm:p-8">
            <h2 className="display text-2xl">Send an enquiry</h2>
            <p className="mt-2 text-ink-muted">
              Tell us what you are planning. Every field marked required must be filled
              in.
            </p>
            <EnquiryForm topics={services.map((service) => service.title)} />
          </div>
        </div>
      </div>
      <section className="border-t-2 border-ink bg-tracing px-4 py-12 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6">
          <h2 className="display text-2xl">Not sure which service applies?</h2>
          <Link href="/#services" className={buttonStyles("ink", "md")}>
            See all services
          </Link>
        </div>
      </section>
    </>
  );
}
