import "server-only";

import { createClient } from "@/lib/supabase/server";
import { fallbackFaqs } from "@/lib/content/fallback";
import type { FaqRow, MediaRow, PageRow } from "@/lib/database.types";

/**
 * Staff reads for the panel. The public site is written in the frontend, so the
 * only things managed here are the FAQ list and the extra pages.
 */

/** Extra pages only. The frontend pages are never listed or editable here. */
export async function getExtraPagesForAdmin(): Promise<PageRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pages")
    .select("*")
    .order("nav_order", { ascending: true })
    .order("title", { ascending: true });

  return (data as PageRow[] | null) ?? [];
}

export async function getPageById(id: string): Promise<PageRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Could not load page: ${error.message}`);
  return data;
}

/**
 * The FAQ list the panel manages. When the table is not there yet the written
 * list is shown instead, so the panel is never empty for no reason.
 */
export async function getAllFaqs(): Promise<FaqRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) return fallbackFaqs;
  return (data as FaqRow[]).length > 0 ? (data as FaqRow[]) : fallbackFaqs;
}

export async function getFaqCount(): Promise<number> {
  return (await getAllFaqs()).length;
}

/** Images already uploaded, used by the page editor and the rich text editor. */
export async function getAllMedia(): Promise<MediaRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });

  return (data as MediaRow[] | null) ?? [];
}
