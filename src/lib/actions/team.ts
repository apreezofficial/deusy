"use server";

import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { teamFormSchema } from "@/lib/validation/schemas";
import { actionError, fieldErrorsFrom, type ActionResult } from "@/lib/actions/result";
import { contentTags } from "@/lib/queries/content";
import { revalidateContent } from "@/lib/revalidate";

export interface SaveTeamResult {
  id: string;
}

export async function saveTeamMember(
  formData: FormData,
): Promise<ActionResult<SaveTeamResult>> {
  await requireStaff();

  const id = formData.get("id") ? String(formData.get("id")) : undefined;

  const parsed = teamFormSchema.safeParse({
    id,
    name: formData.get("name"),
    role: formData.get("role"),
    bio: formData.get("bio") ?? "",
    photo: formData.get("photo") ?? "",
    sortOrder: formData.get("sortOrder"),
    active: formData.get("active") === "on" || formData.get("active") === "true",
  });

  if (!parsed.success) {
    return actionError(
      "The team member was not saved. Fix the highlighted fields and try again.",
      fieldErrorsFrom(parsed.error.issues),
    );
  }

  const { name, role, bio, photo, sortOrder, active } = parsed.data;
  const supabase = await createClient();
  const row = {
    name,
    role,
    bio,
    photo,
    sort_order: sortOrder,
    active,
  };

  const result = id
    ? await supabase.from("team_members").update(row).eq("id", id).select("id").single()
    : await supabase.from("team_members").insert(row).select("id").single();

  if (result.error || !result.data) {
    return actionError(
      "The team member was not saved. Check your connection and try again.",
    );
  }

  revalidateContent([contentTags.team], ["/about"]);
  return { ok: true, data: { id: result.data.id } };
}

export async function deleteTeamMember(
  formData: FormData,
): Promise<ActionResult<undefined>> {
  await requireStaff();

  const id = String(formData.get("id") ?? "");
  if (!id) return actionError("The team member was not removed.");

  const supabase = await createClient();
  const { error } = await supabase.from("team_members").delete().eq("id", id);

  if (error) return actionError("The team member was not removed. Try again in a moment.");

  revalidateContent([contentTags.team], ["/about"]);
  return { ok: true, data: undefined };
}
