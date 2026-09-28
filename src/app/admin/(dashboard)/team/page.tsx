import { getAllMedia, getAllTeamMembers } from "@/lib/queries/admin";
import { TeamManager } from "@/components/admin/TeamManager";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const [members, media] = await Promise.all([getAllTeamMembers(), getAllMedia()]);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="display text-4xl">Team</h1>
        <p className="mt-2 max-w-prose text-ink-muted">
          The people listed under Leadership on the About page.
        </p>
      </header>

      <TeamManager members={members} media={media} />
    </div>
  );
}
