import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getActiveTeam, getTeamMemberBySlug } from "@/lib/queries/content";
import { JsonLd } from "@/components/site/JsonLd";
import { buttonStyles } from "@/components/ui/Button";
import { PersonPhoto, teamHref } from "@/components/site/TeamCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/team/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const member = await getTeamMemberBySlug(slug);

  if (!member) return { title: "Profile not found" };

  const description =
    member.summary?.trim() || `${member.name}, ${member.role} at Deusy Investments Services.`;

  return {
    title: member.name,
    description,
    alternates: { canonical: `/team/${slug}` },
    openGraph: {
      type: "profile",
      title: `${member.name} - ${member.role}`,
      description,
    },
  };
}

export default async function TeamMemberPage({ params }: PageProps<"/team/[slug]">) {
  const { slug } = await params;
  const [member, team] = await Promise.all([getTeamMemberBySlug(slug), getActiveTeam()]);

  if (!member) notFound();

  const others = team.filter((item) => item.id !== member.id);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: member.name,
          jobTitle: member.role,
          description: member.summary ?? undefined,
          worksFor: {
            "@type": "Organization",
            name: "Deusy Investments Services",
          },
        }}
      />

      <header className="grid-plan border-b-2 border-ink">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <Link
            href="/team"
            className="drawing-label inline-flex border-b-2 border-ink pb-1 text-sm transition-colors hover:border-signal hover:text-signal-dark"
          >
            Back to the team
          </Link>
          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
            <PersonPhoto member={member} className="h-32 w-32 sm:h-40 sm:w-40" />
            <div>
              <p className="drawing-label text-sm text-signal-dark">{member.role}</p>
              <h1 className="display reveal mt-3 text-[clamp(2rem,1.3rem+3vw,3.25rem)]">
                {member.name}
              </h1>
              {member.summary ? (
                <p className="reveal reveal-1 mt-4 max-w-[52ch] text-lg text-ink-soft">
                  {member.summary}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-14">
          <article className="edge reveal border-2 border-ink bg-paper p-6 sm:p-9">
            <h2 className="drawing-label text-sm text-signal-dark">Profile</h2>
            {member.bio ? (
              <div className="mt-5 flex flex-col gap-4 text-[1.0625rem] leading-[1.75] text-ink-soft">
                {member.bio.split(/\n{2,}/).map((chunk, index) => (
                  <p key={index}>{chunk}</p>
                ))}
              </div>
            ) : (
              <p className="mt-5 leading-relaxed text-ink-muted">
                The full profile for {member.name} has not been written yet. The short
                description above is all we have published so far.
              </p>
            )}
          </article>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
            <div className="edge-sm reveal-edge border-2 border-ink bg-ink p-6 text-paper">
              <h2 className="drawing-label text-drafting">Work with this person</h2>
              <p className="mt-3 text-paper/80">
                Send your detail and the team routes it to the right desk.
              </p>
              <Link
                href="/contact?intent=consultation"
                className={`${buttonStyles("primary", "md")} mt-5 w-full`}
              >
                Request a consultation
              </Link>
            </div>

            {others.length > 0 ? (
              <div className="reveal-edge border-2 border-ink bg-paper p-6">
                <h2 className="drawing-label text-sm text-signal-dark">Other people</h2>
                <ul className="mt-4 flex flex-col">
                  {others.map((person) => (
                    <li key={person.id} className="border-t border-ink first:border-t-0">
                      <Link href={teamHref(person)} className="block py-3 hover:text-signal-dark">
                        <span className="font-medium">{person.name}</span>
                        <span className="block text-sm text-ink-muted">{person.role}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </>
  );
}
