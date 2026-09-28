"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import { saveTeamMember, deleteTeamMember } from "@/lib/actions/team";
import { formAction } from "@/lib/actions/form-action";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import { Switch } from "@/components/ui/Switch";
import { Dialog } from "@/components/ui/Dialog";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { useToast } from "@/components/ui/Toast";
import type { ActionResult } from "@/lib/actions/result";
import type { MediaRow, TeamMemberRow } from "@/lib/database.types";

export function TeamManager({
  members,
  media,
}: {
  members: TeamMemberRow[];
  media: MediaRow[];
}) {
  const [editing, setEditing] = useState<TeamMemberRow | "new" | null>(null);
  const [pendingDelete, setPendingDelete] = useState<TeamMemberRow | null>(null);
  const { notify } = useToast();

  const remove = async (formData: FormData) => {
    const result = await deleteTeamMember(formData);
    notify(
      result.ok ? "Team member removed" : result.error,
      result.ok ? "success" : "error",
    );
    setPendingDelete(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-prose text-ink-muted">
          Active members appear as cards on the team page and on the About page. Each
          person gets their own page at /team/their-slug, which shows the full profile.
        </p>
        <Button onClick={() => setEditing("new")}>
          <Plus size={16} aria-hidden="true" />
          Add person
        </Button>
      </div>

      {members.length === 0 ? (
        <p className="border-2 border-dashed border-ink bg-paper p-8 text-center">
          No team members yet. Add the first one.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {members.map((member) => (
            <li
              key={member.id}
              className="edge-sm flex flex-wrap items-start justify-between gap-3 border-2 border-ink bg-paper p-4"
            >
              <div>
                <h3 className="drawing-label text-lg">{member.name}</h3>
                <p className="text-sm text-ink-muted">{member.role}</p>
                {!member.active ? (
                  <span className="mt-2 inline-block border-2 border-ink bg-tracing px-2 py-0.5 text-xs">
                    Hidden
                  </span>
                ) : null}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditing(member)}>
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setPendingDelete(member)}
                >
                  <Trash2 size={14} aria-hidden="true" />
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === "new" ? "Add a person" : "Edit person"}
        description="Only add people you have permission to publish."
      >
        {editing ? (
          <TeamForm
            key={editing === "new" ? "new" : editing.id}
            member={editing === "new" ? null : editing}
            media={media}
            onDone={() => setEditing(null)}
            onNotify={notify}
          />
        ) : null}
      </Dialog>

      <Dialog
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        title="Remove this person?"
        description={
          pendingDelete
            ? `${pendingDelete.name} will no longer appear on the About page.`
            : ""
        }
        footer={
          <>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Keep person
            </Button>
            {pendingDelete ? (
              <form action={remove}>
                <input type="hidden" name="id" value={pendingDelete.id} />
                <Button type="submit" variant="danger">
                  Delete person
                </Button>
              </form>
            ) : null}
          </>
        }
      >
        <p>The record is deleted, not just hidden.</p>
      </Dialog>
    </div>
  );
}

function TeamForm({
  member,
  media,
  onDone,
  onNotify,
}: {
  member: TeamMemberRow | null;
  media: MediaRow[];
  onDone: () => void;
  onNotify: (message: string, tone?: "success" | "error") => void;
}) {
  const [state, formActionHandler] = useActionState(
    formAction(saveTeamMember),
    null as ActionResult<{ id: string }> | null,
  );
  const [photo, setPhoto] = useState(member?.photo ?? "");
  const [active, setActive] = useState(member?.active ?? true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const lastResult = useRef(state);

  useEffect(() => {
    if (!state || state === lastResult.current) return;
    lastResult.current = state;

    if (state.ok) {
      onNotify("Team member saved");
      onDone();
    }
  }, [state, onDone, onNotify]);

  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;

  return (
    <form action={formActionHandler} className="flex flex-col gap-4">
      {member ? <input type="hidden" name="id" value={member.id} /> : null}
      <input type="hidden" name="photo" value={photo} />
      <input type="hidden" name="active" value={active ? "true" : "false"} />

      {state && !state.ok ? (
        <p role="alert" className="border-2 border-ink bg-signal px-4 py-3">
          {state.error}
        </p>
      ) : null}

      <Input
        label="Name"
        name="name"
        required
        defaultValue={member?.name ?? ""}
        error={fieldErrors?.name}
      />
      <Input
        label="Profile slug"
        name="slug"
        required
        defaultValue={member?.slug ?? ""}
        hint="The page address: /team/your-slug"
        error={fieldErrors?.slug}
      />
      <Input
        label="Role"
        name="role"
        required
        defaultValue={member?.role ?? ""}
        error={fieldErrors?.role}
      />
      <Textarea
        label="Short description"
        name="summary"
        rows={2}
        defaultValue={member?.summary ?? ""}
        hint="One or two sentences. This is what the cards show."
        error={fieldErrors?.summary}
      />
      <Textarea
        label="Full profile"
        name="bio"
        rows={10}
        defaultValue={member?.bio ?? ""}
        hint="The whole story. This shows on the person's own page."
        error={fieldErrors?.bio}
      />
      <Input
        label="Order"
        name="sortOrder"
        type="number"
        min={0}
        defaultValue={member?.sort_order ?? 0}
        error={fieldErrors?.sortOrder}
      />

      <div className="flex flex-col gap-2">
        <span className="drawing-label text-sm">Photo</span>
        <Image
          src={photo || "/placeholder-person.svg"}
          alt="Selected photo"
          width={120}
          height={120}
          className="h-28 w-28 border-2 border-ink object-cover"
          unoptimized
        />
        <p className="text-sm text-ink-muted">
          {photo ? "A photo is set." : "No photo chosen, so the placeholder is used."}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
            {photo ? "Change photo" : "Choose photo"}
          </Button>
          {photo ? (
            <Button variant="quiet" size="sm" onClick={() => setPhoto("")}>
              Remove photo
            </Button>
          ) : null}
        </div>
        {fieldErrors?.photo ? (
          <p className="text-sm text-signal-dark">{fieldErrors.photo}</p>
        ) : null}
      </div>

      <Switch label="Active" checked={active} onChange={setActive} />

      <div className="flex flex-wrap justify-end gap-3 border-t-2 border-ink pt-4">
        <Button variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit">{member ? "Save changes" : "Add person"}</Button>
      </div>

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        media={media}
        onSelect={(item) => {
          setPhoto(item.url);
          setPickerOpen(false);
        }}
      />
    </form>
  );
}
