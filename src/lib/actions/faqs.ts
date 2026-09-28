"use server";

import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { faqFormSchema } from "@/lib/validation/schemas";
import { actionError, fieldErrorsFrom, type ActionResult } from "@/lib/actions/result";
import { contentTags } from "@/lib/queries/content";
import { revalidateContent } from "@/lib/revalidate";

export interface SaveFaqResult {
  id: string;
}

export async function saveFaq(formData: FormData): Promise<ActionResult<SaveFaqResult>> {
  await requireStaff();

  const id = formData.get("id") ? String(formData.get("id")) : undefined;

  const parsed = faqFormSchema.safeParse({
    id,
    question: formData.get("question"),
    answer: formData.get("answer"),
    sortOrder: formData.get("sortOrder"),
    active: formData.get("active") === "on" || formData.get("active") === "true",
  });

  if (!parsed.success) {
    return actionError(
      "The question was not saved. Fix the highlighted fields and try again.",
      fieldErrorsFrom(parsed.error.issues),
    );
  }

  const { question, answer, sortOrder, active } = parsed.data;
  const supabase = await createClient();

  const result = id
    ? await supabase
        .from("faqs")
        .update({ question, answer, sort_order: sortOrder, active })
        .eq("id", id)
        .select("id")
        .single()
    : await supabase
        .from("faqs")
        .insert({ question, answer, sort_order: sortOrder, active })
        .select("id")
        .single();

  if (result.error || !result.data) {
    return actionError("The question was not saved. Check your connection and try again.");
  }

  revalidateContent([contentTags.faqs], ["/faq"]);
  return { ok: true, data: { id: result.data.id } };
}

export async function toggleFaqActive(
  formData: FormData,
): Promise<ActionResult<undefined>> {
  await requireStaff();

  const id = String(formData.get("id") ?? "");
  const active = formData.get("active") === "true";

  const supabase = await createClient();
  const { error } = await supabase.from("faqs").update({ active }).eq("id", id);

  if (error) return actionError("The question was not updated. Try again in a moment.");

  revalidateContent([contentTags.faqs], ["/faq"]);
  return { ok: true, data: undefined };
}

export async function moveFaq(formData: FormData): Promise<ActionResult<undefined>> {
  await requireStaff();

  const id = String(formData.get("id") ?? "");
  const direction = formData.get("direction") === "up" ? "up" : "down";

  const supabase = await createClient();
  const { data: rows, error: readError } = await supabase
    .from("faqs")
    .select("id, sort_order")
    .order("sort_order", { ascending: true });

  if (readError) return actionError("The order was not changed. Try again in a moment.");

  const index = (rows ?? []).findIndex((row) => row.id === id);
  if (index === -1) return actionError("That question is no longer in the list.");

  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= (rows ?? []).length) {
    return { ok: true, data: undefined };
  }

  const current = (rows ?? [])[index];
  const other = (rows ?? [])[swapWith];

  const { error } = await supabase
    .from("faqs")
    .upsert([
      { id: current.id, sort_order: other.sort_order },
      { id: other.id, sort_order: current.sort_order },
    ]);

  if (error) return actionError("The order was not changed. Try again in a moment.");

  revalidateContent([contentTags.faqs], ["/faq"]);
  return { ok: true, data: undefined };
}

export async function deleteFaq(
  formData: FormData,
): Promise<ActionResult<undefined>> {
  await requireStaff();

  const id = String(formData.get("id") ?? "");
  if (!id) return actionError("The question was not deleted.");

  const supabase = await createClient();
  const { error } = await supabase.from("faqs").delete().eq("id", id);

  if (error) return actionError("The question was not deleted. Try again in a moment.");

  revalidateContent([contentTags.faqs], ["/faq"]);
  return { ok: true, data: undefined };
}
