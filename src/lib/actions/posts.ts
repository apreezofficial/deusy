"use server";

import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { postFormSchema } from "@/lib/validation/schemas";
import { actionError, fieldErrorsFrom, type ActionResult } from "@/lib/actions/result";
import { contentTags } from "@/lib/queries/content";
import { revalidateContent } from "@/lib/revalidate";
import type { Json } from "@/lib/database.types";

export interface SavePostResult {
  id: string;
  slug: string;
  published: boolean;
}

function readForm(formData: FormData) {
  return {
    id: formData.get("id") ? String(formData.get("id")) : undefined,
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    category: formData.get("category"),
    author: formData.get("author"),
    coverImage: formData.get("coverImage"),
    content: formData.get("content"),
    published: formData.get("published") === "on" || formData.get("published") === "true",
  };
}

export async function savePost(
  formData: FormData,
): Promise<ActionResult<SavePostResult>> {
  await requireStaff();

  const parsed = postFormSchema.safeParse(readForm(formData));

  if (!parsed.success) {
    return actionError(
      "The blog post was not saved. Fix the highlighted fields and try again.",
      fieldErrorsFrom(parsed.error.issues),
    );
  }

  const {
    id,
    title,
    slug,
    excerpt,
    category,
    author,
    coverImage,
    content,
    published,
  } = parsed.data;

  if (content === null) {
    return actionError(
      "The blog post was not saved.",
      { content: "The post content could not be read. Reload the editor and try again." },
    );
  }

  // Synchronize with PHP Backend API
  try {
    const phpApiUrl = process.env.NEXT_PUBLIC_PHP_API_URL || "http://localhost:8000";
    await fetch(`${phpApiUrl}/api/admin/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        title,
        slug,
        excerpt,
        category,
        author,
        cover_image: coverImage,
        content,
        published: published ? 1 : 0,
      }),
      signal: AbortSignal.timeout(3000),
    });
  } catch {}

  const supabase = await createClient();
  const now = new Date().toISOString();
  const row = {
    title,
    slug,
    excerpt,
    category,
    author,
    cover_image: coverImage,
    content: content as Json,
    published,
    published_at: published ? now : null,
  };

  if (id) {
    const { data, error } = await supabase
      .from("posts")
      .update(row)
      .eq("id", id)
      .select("id, slug, published")
      .single();

    if (error || !data) {
      return actionError(
        error?.code === "23505"
          ? `The slug "${slug}" is already used by another post. Choose a different one.`
          : `Database error: ${error?.message ?? "could not update post"}`,
      );
    }

    await revalidateContent([contentTags.posts], [`/blog/${data.slug}`, "/blog"]);

    return {
      ok: true,
      data: { id: data.id, slug: data.slug, published: data.published },
    };
  }

  const { data, error } = await supabase
    .from("posts")
    .insert([row])
    .select("id, slug, published")
    .single();

  if (error || !data) {
    return actionError(
      error?.code === "23505"
        ? `The slug "${slug}" is already used by another post. Choose a different one.`
        : `Database error: ${error?.message ?? "could not create post"}`,
    );
  }

  await revalidateContent([contentTags.posts], ["/blog"]);

  redirect(`/admin/posts/${data.id}`);
}

export async function deletePost(id: string): Promise<ActionResult<{ deleted: true }>> {
  await requireStaff();

  // Also sync delete with PHP API
  try {
    const phpApiUrl = process.env.NEXT_PUBLIC_PHP_API_URL || "http://localhost:8000";
    await fetch(`${phpApiUrl}/api/admin/posts/${id}`, {
      method: "DELETE",
      signal: AbortSignal.timeout(3000),
    });
  } catch {}

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id)
    .select("slug")
    .single();

  if (error) {
    return actionError(`Database error: ${error.message}`);
  }

  await revalidateContent([contentTags.posts], ["/blog", `/blog/${data.slug}`]);

  redirect("/admin/posts");
}
