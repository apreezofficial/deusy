import Link from "next/link";
import Image from "next/image";
import type { TeamMemberRow } from "@/lib/database.types";

/** Shown when a person has no photo uploaded yet. */
export const personPlaceholder = "/placeholder-person.svg";

export function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function teamHref(member: TeamMemberRow): string {
  const slug = member.slug?.trim() || slugifyName(member.name);
  return `/team/${slug}`;
}

export function PersonPhoto({
  member,
  className = "h-40 w-40",
}: {
  member: Pick<TeamMemberRow, "name" | "photo">;
  className?: string;
}) {
  return (
    <Image
      src={member.photo?.trim() || personPlaceholder}
      alt={member.photo?.trim() ? member.name : `Portrait placeholder for ${member.name}`}
      width={400}
      height={400}
      className={`${className} border-2 border-ink object-cover`}
      unoptimized
    />
  );
}

export function TeamCard({ member }: { member: TeamMemberRow }) {
  return (
    <li className="edge-sm reveal-edge flex">
      <Link
        href={teamHref(member)}
        className="group flex w-full flex-col bg-paper p-6 transition-[transform,box-shadow] duration-150 hover:-translate-y-1 hover:shadow-[7px_7px_0_0_var(--color-ink)]"
      >
        <PersonPhoto member={member} />
        <h3 className="drawing-label mt-5 text-lg leading-tight group-hover:underline group-hover:decoration-signal group-hover:decoration-2 group-hover:underline-offset-4">
          {member.name}
        </h3>
        <p className="mt-1 text-sm text-signal-dark">{member.role}</p>
        {member.summary ? (
          <p className="mt-3 leading-relaxed text-ink-soft">{member.summary}</p>
        ) : null}
        <span className="drawing-label mt-5 inline-flex items-center gap-2 border-b-2 border-ink text-sm transition-colors group-hover:border-signal">
          Read full profile
        </span>
      </Link>
    </li>
  );
}
