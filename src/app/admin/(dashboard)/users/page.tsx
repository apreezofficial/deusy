import { redirect } from "next/navigation";
import { getActor } from "@/lib/auth";
import { getProfiles } from "@/lib/queries/admin";
import { UserManager } from "@/components/admin/UserManager";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const actor = await getActor();

  if (!actor) redirect("/admin/login");
  if (actor.profile.role !== "admin") redirect("/admin");

  const profiles = await getProfiles();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="display text-4xl">Users</h1>
        <p className="mt-2 max-w-prose text-ink-muted">
          Admins can invite people, change roles and remove access. Editors can change
          content but cannot manage people.
        </p>
      </header>

      <UserManager profiles={profiles} currentUserId={actor.user.id} />
    </div>
  );
}
