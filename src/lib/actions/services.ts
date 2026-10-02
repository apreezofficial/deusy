"use server";

import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { serviceFormSchema } from "@/lib/validation/schemas";
import { actionError, fieldErrorsFrom, type ActionResult } from "@/lib/actions/result";
import { contentTags } from "@/lib/queries/content";
import { revalidateContent } from "@/lib/revalidate";
import type { Json, ServiceKind } from "@/lib/database.types";

function readForm(formData: FormData) {
  return {
    id: formData.get("id") ? String(formData.get("id")) : undefined,
    kind: formData.get("kind"),
    title: formData.get("title"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    scope: formData.getAll("scope").map((value) => String(value)),
    body: formData.get("body") ?? "",
    image: formData.get("image") ?? "",
    sortOrder: formData.get("sortOrder"),
    active: formData.get("active") === "on" || formData.get("active") === "true",
  };
}

export interface SaveServiceResult {
  id: string;
  slug: string;
}

export async function saveService(
  formData: FormData,
): Promise<ActionResult<SaveServiceResult>> {
  await requireStaff();

  const parsed = serviceFormSchema.safeParse(readForm(formData));

  if (!parsed.success) {
    return actionError(
      "The service was not saved. Fix the highlighted fields and try again.",
      fieldErrorsFrom(parsed.error.issues),
    );
  }

  const { id, kind, title, slug, summary, scope, body, image, sortOrder, active } =
    parsed.data;

  const supabase = await createClient();
  const row = {
    kind: kind as ServiceKind,
    title,
    slug,
    summary,
    scope,
    body: (body ?? null) as Json | null,
    image,
    sort_order: sortOrder,
    active,
  };

  // Sync with PHP backend API
  try {
    const phpApiUrl = process.env.NEXT_PUBLIC_PHP_API_URL || "http://localhost:8000";
    await fetch(`${phpApiUrl}/api/admin/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        kind,
        title,
        slug,
        summary,
        scope,
        body,
        image,
        sort_order: sortOrder,
        active: active ? 1 : 0,
      }),
      signal: AbortSignal.timeout(3000),
    });
  } catch {}

  const data = id
    ? await supabase
        .from("services")
        .update(row)
        .eq("id", id)
        .select("id, slug")
        .single()
    : await supabase.from("services").insert(row).select("id, slug").single();

  if (data.error || !data.data) {
    return actionError(
      data.error?.code === "23505"
        ? `The slug "${slug}" is already used by another service. Choose a different one.`
        : "The service was not saved. Check your connection and try again.",
    );
  }

  revalidateContent(
    [contentTags.services],
    ["/", `/services/${data.data.slug}`, "/sitemap.xml"],
  );

  return { ok: true, data: { id: data.data.id, slug: data.data.slug } };
}

export async function deleteService(
  formData: FormData,
): Promise<ActionResult<undefined>> {
  await requireStaff();

  const id = String(formData.get("id") ?? "");
  if (!id) return actionError("The service was not deleted.");

  try {
    const phpApiUrl = process.env.NEXT_PUBLIC_PHP_API_URL || "http://localhost:8000";
    await fetch(`${phpApiUrl}/api/admin/services/${id}`, {
      method: "DELETE",
      signal: AbortSignal.timeout(3000),
    });
  } catch {}

  const supabase = await createClient();
  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) {
    return actionError("The service was not deleted. Check your connection and try again.");
  }

  revalidateContent([contentTags.services], ["/", "/sitemap.xml"]);

  return { ok: true, data: undefined };
}
