"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { inviteUser, changeUserRole } from "@/lib/actions/users";
import { deleteStaffUser } from "@/lib/actions/media";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Field";
import { Dialog } from "@/components/ui/Dialog";
import { useToast } from "@/components/ui/Toast";
import { formatDate } from "@/lib/format";
import type { ProfileRow } from "@/lib/database.types";

export function UserManager({
  profiles,
  currentUserId,
}: {
  profiles: ProfileRow[];
  currentUserId: string;
}) {
  const { notify } = useToast();
  const router = useRouter();
  const [pendingDelete, setPendingDelete] = useState<ProfileRow | null>(null);

  const invite = async (formData: FormData) => {
    const result = await inviteUser(formData);

    if (!result.ok) {
      notify(result.error, "error");
      return;
    }

    notify(`Invitation sent to ${result.data.email}`);
    router.refresh();
  };

  const changeRole = async (profile: ProfileRow, role: "admin" | "editor") => {
    const formData = new FormData();
    formData.set("userId", profile.id);
    formData.set("role", role);

    const result = await changeUserRole(formData);

    if (!result.ok) {
      notify(result.error, "error");
      return;
    }

    notify("Role updated");
    router.refresh();
  };

  const remove = async (formData: FormData) => {
    const result = await deleteStaffUser(formData);

    if (!result.ok) {
      notify(result.error, "error");
      return;
    }

    notify("User removed");
    setPendingDelete(null);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="drawing-label text-lg">Invite someone</h2>
        <p className="mt-1 max-w-prose text-sm text-ink-muted">
          They receive an email from Supabase with a link to set a password. Public
          sign-ups are switched off, so only invited people can reach this panel.
        </p>

        <form action={invite} className="mt-4 flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Email" name="email" type="email" required />
            <Input label="Full name" name="fullName" hint="Optional" />
            <Select label="Role" name="role" defaultValue="editor">
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </Select>
          </div>
          <div>
            <Button type="submit">Send invitation</Button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="drawing-label text-lg">People with access</h2>
        <div className="mt-4">
          {profiles.length === 0 ? (
            <p className="border-2 border-dashed border-ink bg-paper p-8 text-center">
              No staff accounts yet. Invite the first administrator above.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {profiles.map((profile) => (
                <li
                  key={profile.id}
                  className="flex flex-wrap items-center justify-between gap-4 border-2 border-ink bg-paper p-4"
                >
                  <div className="min-w-0">
                    <p className="drawing-label text-base">
                      {profile.full_name ?? "Name not set"}
                      {profile.id === currentUserId ? (
                        <span className="ml-2 border-2 border-ink bg-drafting px-2 py-0.5 text-xs">
                          You
                        </span>
                      ) : null}
                    </p>
                    <p className="text-sm text-ink-muted">
                      {profile.role === "admin" ? "Admin" : "Editor"} since{" "}
                      {formatDate(profile.created_at)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="drawing-label text-sm">
                      {profile.role === "admin" ? "Admin" : "Editor"}
                    </span>

                    {profile.id === currentUserId ? null : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            void changeRole(
                              profile,
                              profile.role === "admin" ? "editor" : "admin",
                            )
                          }
                        >
                          Make {profile.role === "admin" ? "editor" : "admin"}
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setPendingDelete(profile)}
                        >
                          <Trash2 size={14} aria-hidden="true" />
                          Remove
                        </Button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <Dialog
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        title="Remove this person?"
        description={
          pendingDelete
            ? `${
                pendingDelete.full_name ?? "This person"
              } loses access to the admin panel immediately.`
            : ""
        }
        footer={
          <>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Keep access
            </Button>
            {pendingDelete ? (
              <form action={remove}>
                <input type="hidden" name="userId" value={pendingDelete.id} />
                <Button type="submit" variant="danger">
                  Remove access
                </Button>
              </form>
            ) : null}
          </>
        }
      >
        <p>Their sign-in is deleted, so they will need a new invitation to come back.</p>
      </Dialog>
    </div>
  );
}
