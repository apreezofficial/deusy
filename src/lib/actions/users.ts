"use server";

import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { inviteUserFormSchema, roleFormSchema } from "@/lib/validation/schemas";
import { actionError, fieldErrorsFrom, type ActionResult } from "@/lib/actions/result";
import type { UserRole } from "@/lib/database.types";

export interface InviteResult {
  email: string;
}

export async function inviteUser(
  formData: FormData,
): Promise<ActionResult<InviteResult>> {
  const actor = await requireAdmin();

  const parsed = inviteUserFormSchema.safeParse({
    email: formData.get("email"),
    fullName: formData.get("fullName") ?? "",
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return actionError(
      "The invitation was not sent. Fix the highlighted fields and try again.",
      fieldErrorsFrom(parsed.error.issues),
    );
  }

  const { email, fullName, role } = parsed.data;

  if (email.toLowerCase() === actor.user.email?.toLowerCase()) {
    return actionError("You are already signed in with that address.");
  }

  const admin = createAdminClient();

  const { data, error } = await admin.auth.admin.inviteUserByEmail(email);

  if (error || !data.user) {
    return actionError(
      error?.message.includes("already been registered")
        ? "That email already has an account. Ask them to sign in, or change their role below."
        : "The invitation was not sent. Check the address and try again.",
    );
  }

  const supabase = await createClient();
  const { error: profileError } = await supabase.from("profiles").upsert({
    id: data.user.id,
    full_name: fullName || null,
    role: role as UserRole,
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(data.user.id);
    return actionError(
      "The invitation was not completed, so nothing was sent. Try again in a moment.",
    );
  }

  return { ok: true, data: { email } };
}

export async function changeUserRole(
  formData: FormData,
): Promise<ActionResult<undefined>> {
  const actor = await requireAdmin();

  const parsed = roleFormSchema.safeParse({
    userId: formData.get("userId"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return actionError("The role was not changed.", fieldErrorsFrom(parsed.error.issues));
  }

  if (parsed.data.userId === actor.user.id) {
    return actionError("You cannot change your own role. Ask another admin to do it.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role: parsed.data.role as UserRole })
    .eq("id", parsed.data.userId);

  if (error) return actionError("The role was not changed. Try again in a moment.");

  return { ok: true, data: undefined };
}
