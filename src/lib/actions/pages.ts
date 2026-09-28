"use server";

import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { pageFormSchema } from "@/lib/validation/schemas";
import { actionError, fieldErrorsFrom, type ActionResult } from "@/lib/actions/result";
import { contentTags } from "@/lib/queries/content";
import { revalidateContent } from "@/lib/revalidate";
import type { Json } from "@/lib/database.types";

export interface SavePageResult {
  id: string;
  slug: string;
  published: boolean;
}

function readForm(formData: FormData) {
  return {
    id: formData.get("id") ? String(formData.get("id")) : undefined,
    title: formData.get("title"),
    slug: formData.get("slug"),
    subtitle: formData.get("subtitle"),
    template: formData.get("template"),
    content: formData.get("content"),
    published: formData.get("published") === "on" || formData.get("published") === "true",
    showInNav: formData.get("showInNav") === "on" || formData.get("showInNav") === "true",
    navLabel: formData.get("navLabel"),
    navOrder: formData.get("navOrder"),
    seoTitle: formData.get("seoTitle"),
    seoDesc: formData.get("seoDesc"),
    ogImage: formData.get("ogImage"),
  };
}

export async function savePage(
  formData: FormData,
): Promise<ActionResult<SavePageResult>> {
  await requireStaff();

  const parsed = pageFormSchema.safeParse(readForm(formData));

  if (!parsed.success) {
    return actionError(
      "The page was not saved. Fix the highlighted fields and try again.",
      fieldErrorsFrom(parsed.error.issues),
    );
  }

  const {
    id,
    title,
    slug,
    subtitle,
    template,
    content,
    published,
    showInNav,
    navLabel,
    navOrder,
    seoTitle,
    seoDesc,
    ogImage,
  } = parsed.data;

  if (content === null) {
    return actionError(
      "The page was not saved.",
      { content: "The page content could not be read. Reload the editor and try again." },
    );
  }

  const supabase = await createClient();
  const row = {
    title,
    slug,
    subtitle,
    template,
    content: content as Json,
    published,
    show_in_nav: showInNav,
    nav_label: navLabel,
    nav_order: navOrder,
    seo_title: seoTitle,
    seo_desc: seoDesc,
    og_image: ogImage,
  };

  if (id) {
    const { data, error } = await supabase
      .from("pages")
      .update(row)
      .eq("id", id)
      .select("id, slug, published")
      .single();

    if (error || !data) {
      return actionError(
        error?.code === "23505"
          ? `The slug "${slug}" is already used by another page. Choose a different one.`
          : "The page was not saved. Check your connection and try again.",
      );
    }

    revalidateContent(
      [contentTags.pages, contentTags.nav],
      ["/", `/${data.slug}`, "/sitemap.xml"],
    );

    return { ok: true, data: { id: data.id, slug: data.slug, published: data.published } };
  }

  const { data, error } = await supabase
    .from("pages")
    .insert(row)
    .select("id, slug, published")
    .single();

  if (error || !data) {
    return actionError(
      error?.code === "23505"
        ? `The slug "${slug}" is already used by another page. Choose a different one.`
        : "The page was not created. Check your connection and try again.",
    );
  }

  revalidateContent(
    [contentTags.pages, contentTags.nav],
    ["/", `/${data.slug}`, "/sitemap.xml"],
  );

  return { ok: true, data: { id: data.id, slug: data.slug, published: data.published } };
}

export async function deletePage(formData: FormData): Promise<ActionResult<undefined>> {
  await requireStaff();

  const id = String(formData.get("id") ?? "");
  if (!id) return actionError("The page could not be deleted. Reload and try again.");

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("pages")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("pages").delete().eq("id", id);

  if (error) {
    return actionError("The page was not deleted. Check your connection and try again.");
  }

  revalidateContent(
    [contentTags.pages, contentTags.nav],
    ["/", `/${existing?.slug ?? ""}`, "/sitemap.xml"],
  );

  redirect("/admin/pages");
}

export async function checkPageSlug(
  slug: string,
  currentId?: string,
): Promise<ActionResult<{ available: boolean }>> {
  await requireStaff();

  const normalised = slug.trim().toLowerCase();
  if (!normalised) return { ok: true, data: { available: false } };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .select("id")
    .eq("slug", normalised)
    .maybeSingle();

  if (error) return actionError("Could not check the slug. Try again in a moment.");

  return {
    ok: true,
    data: { available: !data || data.id === currentId },
  };
}
