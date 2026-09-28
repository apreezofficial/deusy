import "server-only";

import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/lib/database.types";
import {
  parseHomeSettings,
  parseSiteSettings,
  defaultHomeSettings,
  defaultSiteSettings,
  type HomeSettings,
  type SiteSettings,
} from "@/lib/content/settings";
import {
  fallbackFaqs,
  fallbackHomeSettings,
  fallbackPages,
  fallbackServices,
  fallbackSiteSettings,
  fallbackTeam,
} from "@/lib/content/fallback";
import type {
  EnquiryRow,
  EnquiryStatus,
  FaqRow,
  PageRow,
  ServiceRow,
  TeamMemberRow,
} from "@/lib/database.types";

export const contentTags = {
  settings: "settings",
  home: "settings-home",
  nav: "nav-pages",
  pages: "pages",
  services: "services",
  faqs: "faqs",
  team: "team",
  enquiries: "enquiries",
  media: "media",
} as const;

export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    const supabase = createPublicClient();
    if (!supabase) return fallbackSiteSettings;

    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("key", "site")
      .maybeSingle();

    if (error) throw new Error(`Could not load site settings: ${error.message}`);
    return data ? parseSiteSettings(data.value) : defaultSiteSettings;
  },
  ["site-settings"],
  { tags: [contentTags.settings] },
);

export const getHomeSettings = unstable_cache(
  async (): Promise<HomeSettings> => {
    const supabase = createPublicClient();
    if (!supabase) return fallbackHomeSettings;

    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("key", "home")
      .maybeSingle();

    if (error) {
      throw new Error(`Could not load home page settings: ${error.message}`);
    }
    return data ? parseHomeSettings(data.value) : defaultHomeSettings;
  },
  ["home-settings"],
  { tags: [contentTags.home] },
);

export const getNavPages = unstable_cache(
  async (): Promise<PageRow[]> => {
    const supabase = createPublicClient();
    if (!supabase) return fallbackPages;

    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("published", true)
      .eq("show_in_nav", true)
      .order("nav_order", { ascending: true })
      .order("title", { ascending: true });

    if (error) throw new Error(`Could not load navigation: ${error.message}`);
    return data ?? [];
  },
  ["nav-pages"],
  { tags: [contentTags.nav, contentTags.pages] },
);

export const getPublishedPages = unstable_cache(
  async (): Promise<PageRow[]> => {
    const supabase = createPublicClient();
    if (!supabase) return fallbackPages;

    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("published", true)
      .order("nav_order", { ascending: true })
      .order("title", { ascending: true });

    if (error) throw new Error(`Could not load pages: ${error.message}`);
    return data ?? [];
  },
  ["published-pages"],
  { tags: [contentTags.pages] },
);

export const getPublishedPage = unstable_cache(
  async (slug: string): Promise<PageRow | null> => {
    const supabase = createPublicClient();
    if (!supabase) {
      return fallbackPages.find((page) => page.slug === slug) ?? null;
    }

    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error) throw new Error(`Could not load page: ${error.message}`);
    return data;
  },
  ["published-page"],
  { tags: [contentTags.pages] },
);

export const getServices = unstable_cache(
  async (kind?: "practice" | "agency"): Promise<ServiceRow[]> => {
    const supabase = createPublicClient();
    if (!supabase) {
      return kind
        ? fallbackServices.filter((service) => service.kind === kind)
        : fallbackServices;
    }

    let query = supabase
      .from("services")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });

    if (kind) query = query.eq("kind", kind);

    const { data, error } = await query;
    if (error) throw new Error(`Could not load services: ${error.message}`);
    return data ?? [];
  },
  ["services"],
  { tags: [contentTags.services] },
);

export const getService = unstable_cache(
  async (slug: string): Promise<ServiceRow | null> => {
    const supabase = createPublicClient();
    if (!supabase) {
      return fallbackServices.find((service) => service.slug === slug) ?? null;
    }

    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle();

    if (error) throw new Error(`Could not load service: ${error.message}`);
    return data;
  },
  ["service"],
  { tags: [contentTags.services] },
);

export const getActiveFaqs = unstable_cache(
  async (): Promise<FaqRow[]> => {
    const supabase = createPublicClient();
    if (!supabase) return fallbackFaqs;

    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });

    if (error) throw new Error(`Could not load FAQs: ${error.message}`);
    return data ?? [];
  },
  ["faqs"],
  { tags: [contentTags.faqs] },
);

export const getActiveTeam = unstable_cache(
  async (): Promise<TeamMemberRow[]> => {
    const supabase = createPublicClient();
    if (!supabase) return fallbackTeam;

    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });

    if (error) throw new Error(`Could not load team: ${error.message}`);
    return data ?? [];
  },
  ["team"],
  { tags: [contentTags.team] },
);

export const getTeamMemberBySlug = unstable_cache(
  async (slug: string): Promise<TeamMemberRow | null> => {
    const supabase = createPublicClient();
    if (!supabase) return fallbackTeam.find((member) => member.slug === slug) ?? null;

    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle();

    if (error) throw new Error(`Could not load the profile: ${error.message}`);
    return data;
  },
  ["team-member-by-slug"],
  { tags: [contentTags.team] },
);

/**
 * Reads a page whatever its published state, for the staff draft preview.
 * Uncached so the admin always sees the current row.
 */
export async function getPageBySlug(slug: string): Promise<PageRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(`Could not load page: ${error.message}`);
  return data;
}

export type EnquiryFilter = "all" | EnquiryStatus;

/** Staff inbox read. Uncached so the admin always sees current data. */
export async function getEnquiries(filter: EnquiryFilter = "all"): Promise<EnquiryRow[]> {
  const supabase = await createClient();
  let query = supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (filter !== "all") query = query.eq("status", filter);

  const { data, error } = await query;
  if (error) throw new Error(`Could not load enquiries: ${error.message}`);
  return data ?? [];
}

export async function getEnquiry(id: string): Promise<EnquiryRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("enquiries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Could not load enquiry: ${error.message}`);
  return data;
}

export type StaffProfile = Database["public"]["Tables"]["profiles"]["Row"];
