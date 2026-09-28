"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { enquiryFormSchema } from "@/lib/validation/schemas";
import { actionError, fieldErrorsFrom, type ActionResult } from "@/lib/actions/result";

const THROTTLE_WINDOW_MS = 60_000;

function toRecord(formData: FormData) {
  return {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    topic: formData.get("topic"),
    message: formData.get("message"),
    website: formData.get("website"),
  };
}

export async function submitEnquiry(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const parsed = enquiryFormSchema.safeParse(toRecord(formData));

  if (!parsed.success) {
    return actionError(
      "Check the highlighted fields and send again.",
      fieldErrorsFrom(parsed.error.issues),
    );
  }

  const { name, email, phone, topic, message, website } = parsed.data;

  if (website) {
    // Honeypot filled in: accept silently so bots do not retry with fixes.
    return { ok: true, data: { id: "accepted" } };
  }

  if (!isSupabaseConfigured()) {
    return actionError(
      "Enquiries cannot be sent yet. The site is not connected to its database.",
    );
  }

  const supabase = await createClient();

  const since = new Date(Date.now() - THROTTLE_WINDOW_MS).toISOString();
  const { data: recent, error: recentError } = await supabase
    .from("enquiries")
    .select("id")
    .eq("email", email)
    .gte("created_at", since)
    .limit(1);

  if (recentError) {
    return actionError(
      "We could not check your last message. Try again in a moment.",
    );
  }

  if (recent && recent.length > 0) {
    return actionError(
      "You sent a message less than a minute ago. Wait a moment before sending another.",
    );
  }

  const { data, error } = await supabase
    .from("enquiries")
    .insert({ name, email, phone, topic, message, status: "new" })
    .select("id")
    .single();

  if (error || !data) {
    return actionError(
      "Your message was not sent. Check your connection and try again.",
    );
  }

  return { ok: true, data: { id: data.id } };
}
