import "server-only";

import { cache } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRow } from "@/lib/database.types";

export interface Actor {
  user: User;
  profile: ProfileRow;
}

/**
 * Resolves the signed-in user and their profile once per request.
 * getUser() revalidates the token with Supabase Auth, so a stale or
 * hand-edited cookie cannot grant access.
 */
export const getActor = cache(async (): Promise<Actor | null> => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) return null;

  return { user, profile };
});

export async function requireStaff(): Promise<Actor> {
  const actor = await getActor();
  if (!actor) throw new Error("Not signed in");
  return actor;
}

export async function requireAdmin(): Promise<Actor> {
  const actor = await getActor();
  if (!actor) throw new Error("Not signed in");
  if (actor.profile.role !== "admin") {
    throw new Error("Only admins can do that");
  }
  return actor;
}
