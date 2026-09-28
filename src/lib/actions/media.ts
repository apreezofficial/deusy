"use server";

import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  allowedMediaTypes,
  mediaAltFormSchema,
  mediaUploadSchema,
} from "@/lib/validation/schemas";
import { actionError, fieldErrorsFrom, type ActionResult } from "@/lib/actions/result";
import { contentTags } from "@/lib/queries/content";
import { revalidateContent } from "@/lib/revalidate";

const BUCKET = "media";

/** Builds a collision-free storage path from the file the user picked. */
function buildPath(fileName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "bin";
  const base = fileName
    .slice(0, fileName.length - (extension.length + 1))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  const stamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return `${base || "image"}-${stamp}-${random}.${extension}`;
}

export async function uploadMedia(
  formData: FormData,
): Promise<ActionResult<{ url: string }>> {
  await requireStaff();

  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return actionError("Choose an image to upload.", { file: "Choose an image to upload." });
  }

  if (!(allowedMediaTypes as readonly string[]).includes(file.type)) {
    return actionError(
      "That file type is not allowed. Use jpeg, png, webp or svg.",
      { file: "That file type is not allowed." },
    );
  }

  const path = buildPath(file.name);

  const parsed = mediaUploadSchema.safeParse({
    path,
    alt: formData.get("alt") ?? "",
    sizeBytes: file.size,
  });

  if (!parsed.success) {
    return actionError(
      "The image was not uploaded.",
      fieldErrorsFrom(parsed.error.issues),
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    return actionError("The image was not uploaded. Try again in a moment.");
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const url = urlData.publicUrl;

  const { error: insertError } = await supabase.from("media").insert({
    path,
    url,
    alt: parsed.data.alt,
    size_bytes: parsed.data.sizeBytes,
  });

  if (insertError) {
    await supabase.storage.from(BUCKET).remove([path]);
    return actionError("The image was not saved to the library. Try again in a moment.");
  }

  revalidateContent([contentTags.media]);

  return { ok: true, data: { url } };
}

export async function updateMediaAlt(
  formData: FormData,
): Promise<ActionResult<undefined>> {
  await requireStaff();

  const parsed = mediaAltFormSchema.safeParse({
    id: formData.get("id"),
    alt: formData.get("alt") ?? "",
  });

  if (!parsed.success) {
    return actionError(
      "The description was not saved.",
      fieldErrorsFrom(parsed.error.issues),
    );
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("media")
    .update({ alt: parsed.data.alt })
    .eq("id", parsed.data.id);

  if (error) return actionError("The description was not saved. Try again in a moment.");

  revalidateContent([contentTags.media]);
  return { ok: true, data: undefined };
}

export async function deleteMedia(
  formData: FormData,
): Promise<ActionResult<undefined>> {
  await requireStaff();

  const id = String(formData.get("id") ?? "");
  if (!id) return actionError("The image was not deleted.");

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("media")
    .select("path")
    .eq("id", id)
    .maybeSingle();

  if (!existing) return actionError("That image is no longer in the library.");

  const { error: storageError } = await supabase.storage
    .from(BUCKET)
    .remove([existing.path]);

  if (storageError) {
    return actionError(
      "The stored file could not be removed, so nothing was deleted. Try again.",
    );
  }

  const { error } = await supabase.from("media").delete().eq("id", id);

  if (error) return actionError("The image was not removed from the library.");

  revalidateContent([contentTags.media]);
  return { ok: true, data: undefined };
}

/** Removes a user whose Auth record and profile row both go. */
export async function deleteStaffUser(
  formData: FormData,
): Promise<ActionResult<undefined>> {
  await requireStaff();

  const userId = String(formData.get("userId") ?? "");
  if (!userId) return actionError("That user could not be removed.");

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);

  if (error) {
    return actionError(
      "That user could not be removed. Remove them in Supabase, then refresh this page.",
    );
  }

  return { ok: true, data: undefined };
}
