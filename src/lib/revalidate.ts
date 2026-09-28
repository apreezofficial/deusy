import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";
import { contentTags } from "@/lib/queries/content";

type Tag = (typeof contentTags)[keyof typeof contentTags];

/**
 * Public pages are rendered per request and their data comes from the tagged
 * data cache, so a single call here refreshes both the data and the HTML.
 */
export function revalidateContent(tags: Tag[], paths: string[] = ["/"]) {
  for (const tag of tags) revalidateTag(tag, "max");
  for (const path of paths) revalidatePath(path);
}

export const publicPaths = {
  home: "/",
  sitemap: "/sitemap.xml",
};
