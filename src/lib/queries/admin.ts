import "server-only";

import { createClient } from "@/lib/supabase/server";
import type {
  FaqRow,
  MediaRow,
  PageRow,
  ProfileRow,
  ServiceRow,
  TeamMemberRow,
} from "@/lib/database.types";

/** Every admin list is uncached so staff always see the current rows. */

export async function getAllPages(): Promise<PageRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .order("nav_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) throw new Error(`Could not load pages: ${error.message}`);
  return data ?? [];
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

export async function getAllServices(): Promise<ServiceRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("kind", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Could not load services: ${error.message}`);
  return data ?? [];
}

export async function getServiceById(id: string): Promise<ServiceRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Could not load service: ${error.message}`);
  return data;
}

export async function getAllFaqs(): Promise<FaqRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Could not load FAQs: ${error.message}`);
  return data ?? [];
}

export async function getAllTeamMembers(): Promise<TeamMemberRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Could not load team: ${error.message}`);
  return data ?? [];
}

export async function getAllMedia(): Promise<MediaRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Could not load media: ${error.message}`);
  return data ?? [];
}

export async function getProfiles(): Promise<ProfileRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Could not load users: ${error.message}`);
  return data ?? [];
}

export interface DashboardStats {
  publishedPages: number;
  draftPages: number;
  newEnquiries: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const [published, drafts, fresh] = await Promise.all([
    supabase.from("pages").select("id", { count: "exact", head: true }).eq("published", true),
    supabase.from("pages").select("id", { count: "exact", head: true }).eq("published", false),
    supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);

  for (const result of [published, drafts, fresh]) {
    if (result.error) {
      throw new Error(`Could not load dashboard counts: ${result.error.message}`);
    }
  }

  return {
    publishedPages: published.count ?? 0,
    draftPages: drafts.count ?? 0,
    newEnquiries: fresh.count ?? 0,
  };
}
