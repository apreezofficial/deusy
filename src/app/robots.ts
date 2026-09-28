import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = await getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
