export interface SiteSettings {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  whatsapp: string;
  addressLines: string[];
  hours: string;
  logoUrl: string;
  socials: { label: string; url: string }[];
}

export interface HomeSettings {
  heroTitle: string;
  heroIntro: string;
  servicesHeading: string;
  agencyHeading: string;
  closingHeading: string;
}

export const defaultSiteSettings: SiteSettings = {
  name: "Deusy & Planners Services",
  tagline: "Building People | Planning Solutions | Creating Value",
  phone: "",
  email: "",
  whatsapp: "",
  addressLines: [],
  hours: "",
  logoUrl: "",
  socials: [],
};

export const defaultHomeSettings: HomeSettings = {
  heroTitle: "",
  heroIntro: "",
  servicesHeading: "",
  agencyHeading: "",
  closingHeading: "",
};

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function asSocials(value: unknown): { label: string; url: string }[] {
  if (!Array.isArray(value)) return [];
  const result: { label: string; url: string }[] = [];
  for (const entry of value) {
    if (typeof entry !== "object" || entry === null) continue;
    const record = entry as Record<string, unknown>;
    const label = asString(record.label);
    const url = asString(record.url);
    if (label && url) result.push({ label, url });
  }
  return result;
}

export function parseSiteSettings(value: unknown): SiteSettings {
  if (typeof value !== "object" || value === null) return defaultSiteSettings;
  const record = value as Record<string, unknown>;
  return {
    name: asString(record.name, defaultSiteSettings.name),
    tagline: asString(record.tagline, defaultSiteSettings.tagline),
    phone: asString(record.phone),
    email: asString(record.email),
    whatsapp: asString(record.whatsapp),
    addressLines: asStringList(record.addressLines ?? record.address_lines),
    hours: asString(record.hours),
    logoUrl: asString(record.logoUrl ?? record.logo_url),
    socials: asSocials(record.socials),
  };
}

export function parseHomeSettings(value: unknown): HomeSettings {
  if (typeof value !== "object" || value === null) return defaultHomeSettings;
  const record = value as Record<string, unknown>;
  return {
    heroTitle: asString(record.heroTitle ?? record.hero_title),
    heroIntro: asString(record.heroIntro ?? record.hero_intro),
    servicesHeading: asString(
      record.servicesHeading ?? record.services_heading,
    ),
    agencyHeading: asString(record.agencyHeading ?? record.agency_heading),
    closingHeading: asString(record.closingHeading ?? record.closing_heading),
  };
}

export function toSiteSettingsValue(settings: SiteSettings): Record<
  string,
  unknown
> {
  return {
    name: settings.name,
    tagline: settings.tagline,
    phone: settings.phone,
    email: settings.email,
    whatsapp: settings.whatsapp,
    addressLines: settings.addressLines,
    hours: settings.hours,
    logoUrl: settings.logoUrl,
    socials: settings.socials,
  };
}

export function toHomeSettingsValue(settings: HomeSettings): Record<
  string,
  unknown
> {
  return {
    heroTitle: settings.heroTitle,
    heroIntro: settings.heroIntro,
    servicesHeading: settings.servicesHeading,
    agencyHeading: settings.agencyHeading,
    closingHeading: settings.closingHeading,
  };
}
