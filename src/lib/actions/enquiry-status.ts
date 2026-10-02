"use server";

import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { actionError, type ActionResult } from "@/lib/actions/result";
import { contentTags } from "@/lib/queries/content";
import { revalidateContent } from "@/lib/revalidate";
import type { EnquiryStatus } from "@/lib/database.types";

function readStatus(value: FormDataEntryValue | null): EnquiryStatus | null {
  if (value === "read" || value === "archived") return value;
  return null;
}

export async function setEnquiryStatus(
  formData: FormData,
): Promise<ActionResult<undefined>> {
  await requireStaff();

  const id = String(formData.get("id") ?? "");
  const status = readStatus(formData.get("status"));

  if (!id || !status) return actionError("The enquiry was not updated.");

  try {
    const phpApiUrl = process.env.NEXT_PUBLIC_PHP_API_URL || "http://localhost:8000";
    await fetch(`${phpApiUrl}/api/admin/enquiries/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
      signal: AbortSignal.timeout(3000),
    });
  } catch {}

  const supabase = await createClient();
  const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);

  if (error) return actionError("The enquiry was not updated. Try again in a moment.");

  revalidateContent([contentTags.enquiries], ["/admin/enquiries"]);
  return { ok: true, data: undefined };
}

export async function deleteEnquiry(
  formData: FormData,
): Promise<ActionResult<undefined>> {
  await requireStaff();

  const id = String(formData.get("id") ?? "");
  if (!id) return actionError("The enquiry was not deleted.");

  try {
    const phpApiUrl = process.env.NEXT_PUBLIC_PHP_API_URL || "http://localhost:8000";
    await fetch(`${phpApiUrl}/api/admin/enquiries/${id}`, {
      method: "DELETE",
      signal: AbortSignal.timeout(3000),
    });
  } catch {}

  const supabase = await createClient();
  const { error } = await supabase.from("enquiries").delete().eq("id", id);

  if (error) return actionError("The enquiry was not deleted. Try again in a moment.");

  revalidateContent([contentTags.enquiries], ["/admin/enquiries"]);
  return { ok: true, data: undefined };
}
