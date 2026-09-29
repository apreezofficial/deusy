import "server-only";

import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/lib/database.types";
import {
  parseHomeSettings,
  parseSiteSettings,
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
    return fallbackSiteSettings;
  },
  ["site-settings"],
  { tags: [contentTags.settings] },
);

export const getHomeSettings = unstable_cache(
  async (): Promise<HomeSettings> => {
    return fallbackHomeSettings;
  },
  ["home-settings"],
  { tags: [contentTags.home] },
);

/** Navigation comes from the pages written in the frontend, plus extra pages. */
export const getNavPages = unstable_cache(
  async (): Promise<PageRow[]> => {
    return fallbackPages.filter((page) => page.show_in_nav);
  },
  ["nav-pages"],
  { tags: [contentTags.nav, contentTags.pages] },
);

export const getPublishedPages = unstable_cache(
  async (): Promise<PageRow[]> => {
    return [...fallbackPages, ...(await getExtraPages())];
  },
  ["published-pages"],
  { tags: [contentTags.pages] },
);

export const getPublishedPage = unstable_cache(
  async (slug: string): Promise<PageRow | null> => {
    const own = fallbackPages.find((page) => page.slug === slug);
    if (own) return own;

    // Anything that is not one of our frontend pages is an extra page added
    // from the admin panel. A missing or unreachable table is not an error worth
    // failing a page for.
    try {
      const supabase = createPublicClient();
      if (!supabase) return null;

      const { data } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      return (data as PageRow | null) ?? null;
    } catch {
      return null;
    }
  },
  ["published-page"],
  { tags: [contentTags.pages] },
);

export const getServices = unstable_cache(
  async (kind?: "practice" | "agency"): Promise<ServiceRow[]> => {
    return kind
      ? fallbackServices.filter((service) => service.kind === kind)
      : fallbackServices;
  },
  ["services"],
  { tags: [contentTags.services] },
);

export const getService = unstable_cache(
  async (slug: string): Promise<ServiceRow | null> => {
    return fallbackServices.find((service) => service.slug === slug) ?? null;
  },
  ["service"],
  { tags: [contentTags.services] },
);

export const getActiveFaqs = unstable_cache(
  async (): Promise<FaqRow[]> => {
    try {
      const supabase = createPublicClient();
      if (!supabase) return fallbackFaqs;

      const { data } = await supabase
        .from("faqs")
        .select("*")
        .eq("active", true)
        .order("sort_order", { ascending: true });

      // Before the table is created the site keeps showing the written list.
      return data && data.length > 0 ? (data as FaqRow[]) : fallbackFaqs;
    } catch {
      return fallbackFaqs;
    }
  },
  ["faqs"],
  { tags: [contentTags.faqs] },
);

export const getActiveTeam = unstable_cache(
  async (): Promise<TeamMemberRow[]> => {
    return fallbackTeam;
  },
  ["team"],
  { tags: [contentTags.team] },
);

export const getTeamMemberBySlug = unstable_cache(
  async (slug: string): Promise<TeamMemberRow | null> => {
    return fallbackTeam.find((member) => member.slug === slug) ?? null;
  },
  ["team-member-by-slug"],
  { tags: [contentTags.team] },
);

/**
 * Extra pages are the ones created from the admin panel. They never replace the
 * pages written in the frontend, and a project without the table simply has
 * none.
 */
export async function getExtraPages(): Promise<PageRow[]> {
  try {
    const supabase = createPublicClient();
    if (!supabase) return [];

    const { data } = await supabase
      .from("pages")
      .select("*")
      .eq("published", true)
      .order("nav_order", { ascending: true });

    if (!data) return [];

    const own = new Set(fallbackPages.map((page) => page.slug));
    return (data as PageRow[]).filter((page) => !own.has(page.slug));
  } catch {
    return [];
  }
}

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
