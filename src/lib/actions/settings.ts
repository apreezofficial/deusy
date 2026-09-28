"use server";

import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  homeSettingsFormSchema,
  siteSettingsFormSchema,
} from "@/lib/validation/schemas";
import { actionError, fieldErrorsFrom, type ActionResult } from "@/lib/actions/result";
import { contentTags } from "@/lib/queries/content";
import { revalidateContent } from "@/lib/revalidate";
import {
  toHomeSettingsValue,
  toSiteSettingsValue,
  type HomeSettings,
  type SiteSettings,
} from "@/lib/content/settings";

export async function saveSiteSettings(
  formData: FormData,
): Promise<ActionResult<SiteSettings>> {
  await requireStaff();

  const socials = formData
    .getAll("socialLabel")
    .map((label, index) => ({
      label: String(label),
      url: String(formData.getAll("socialUrl")[index] ?? ""),
    }))
    .filter((social) => social.label.trim() || social.url.trim());

  const parsed = siteSettingsFormSchema.safeParse({
    name: formData.get("name"),
    tagline: formData.get("tagline") ?? "",
    phone: formData.get("phone") ?? "",
    email: formData.get("email") ?? "",
    whatsapp: formData.get("whatsapp") ?? "",
    addressLines: formData
      .getAll("addressLine")
      .map((line) => String(line))
      .filter((line) => line.trim()),
    hours: formData.get("hours") ?? "",
    logoUrl: formData.get("logoUrl") ?? "",
    socials,
  });

  if (!parsed.success) {
    return actionError(
      "The settings were not saved. Fix the highlighted fields and try again.",
      fieldErrorsFrom(parsed.error.issues),
    );
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("settings")
    .upsert({ key: "site", value: toSiteSettingsValue(parsed.data) });

  if (error) {
    return actionError("The settings were not saved. Check your connection and try again.");
  }

  revalidateContent([contentTags.settings], ["/", "/contact"]);
  return { ok: true, data: parsed.data };
}

export async function saveHomeSettings(
  formData: FormData,
): Promise<ActionResult<HomeSettings>> {
  await requireStaff();

  const processSteps = formData
    .getAll("processStepTitle")
    .map((title, index) => ({
      title: String(title),
      text: String(formData.getAll("processStepText")[index] ?? ""),
    }))
    .filter((step) => step.title.trim() || step.text.trim());

  const parsed = homeSettingsFormSchema.safeParse({
    heroTitle: formData.get("heroTitle") ?? "",
    heroIntro: formData.get("heroIntro") ?? "",
    servicesHeading: formData.get("servicesHeading") ?? "",
    agencyHeading: formData.get("agencyHeading") ?? "",
    closingHeading: formData.get("closingHeading") ?? "",
    processHeading: formData.get("processHeading") ?? "",
    processIntro: formData.get("processIntro") ?? "",
    processSteps,
  });

  if (!parsed.success) {
    return actionError(
      "The home page text was not saved. Fix the highlighted fields and try again.",
      fieldErrorsFrom(parsed.error.issues),
    );
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("settings")
    .upsert({ key: "home", value: toHomeSettingsValue(parsed.data) });

  if (error) {
    return actionError("The home page text was not saved. Check your connection and try again.");
  }

  revalidateContent([contentTags.home], ["/"]);
  return { ok: true, data: parsed.data };
}
