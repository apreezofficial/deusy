import type { MetadataRoute } from "next";
import { getPublishedPages, getServices } from "@/lib/queries/content";
import { getBaseUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, services, baseUrl] = await Promise.all([
    getPublishedPages(),
    getServices(),
    getBaseUrl(),
  ]);

  return [
    { url: `${baseUrl}/`, changeFrequency: "monthly", priority: 1 },
    ...pages.map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: new Date(page.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...services.map((service) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: new Date(service.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
