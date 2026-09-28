import { z } from "zod";

export const emptyDoc = {
  type: "doc",
  content: [{ type: "paragraph" }],
} as const;

export const reservedSlugs = [
  "admin",
  "api",
  "services",
  "login",
  "sitemap.xml",
  "robots.txt",
] as const;

export const slugSchema = z
  .string()
  .trim()
  .min(1, "Enter a slug")
  .max(120, "Keep the slug under 120 characters")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers and single hyphens only",
  )
  .refine(
    (value) => !(reservedSlugs as readonly string[]).includes(value),
    "That slug is reserved by the site. Choose another one.",
  );

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Keep this under ${max} characters`)
    .optional()
    .transform((value) => (value ? value : null));

const optionalUrl = z
  .string()
  .trim()
  .max(500, "Keep the link under 500 characters")
  .optional()
  .transform((value) => (value ? value : null))
  .refine(
    (value) => value === null || /^https?:\/\/[^\s]+$/i.test(value),
    "Enter a full link starting with https://",
  );

export const pageFormSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1, "Enter a title").max(160, "Keep the title under 160 characters"),
  slug: slugSchema,
  subtitle: optionalText(300),
  template: z.enum(["standard", "faq", "contact"]),
  content: z.string().transform((value) => {
    try {
      const parsed: unknown = JSON.parse(value);
      return parsed;
    } catch {
      return null;
    }
  }),
  published: z.coerce.boolean(),
  showInNav: z.coerce.boolean(),
  navLabel: optionalText(60),
  navOrder: z.coerce.number().int().min(0).max(999),
  seoTitle: optionalText(160),
  seoDesc: optionalText(300),
  ogImage: optionalUrl,
});

export const serviceFormSchema = z.object({
  id: z.string().uuid().optional(),
  kind: z.enum(["practice", "agency"]),
  title: z.string().trim().min(1, "Enter a title").max(160, "Keep the title under 160 characters"),
  slug: slugSchema,
  summary: z
    .string()
    .trim()
    .min(1, "Enter a summary")
    .max(600, "Keep the summary under 600 characters"),
  scope: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Remove the empty item")
        .max(120, "Keep each item under 120 characters"),
    )
    .max(20, "Twenty scope items is the limit"),
  body: z
    .string()
    .optional()
    .transform((value) => {
      if (!value || !value.trim()) return null;
      try {
        const parsed: unknown = JSON.parse(value);
        return parsed;
      } catch {
        return null;
      }
    }),
  image: optionalUrl,
  sortOrder: z.coerce.number().int().min(0).max(999),
  active: z.coerce.boolean(),
});

export const faqFormSchema = z.object({
  id: z.string().uuid().optional(),
  question: z
    .string()
    .trim()
    .min(1, "Enter a question")
    .max(300, "Keep the question under 300 characters"),
  answer: z
    .string()
    .trim()
    .min(1, "Enter an answer")
    .max(4000, "Keep the answer under 4000 characters"),
  sortOrder: z.coerce.number().int().min(0).max(999),
  active: z.coerce.boolean(),
});

export const teamFormSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, "Enter a name").max(120, "Keep the name under 120 characters"),
  role: z.string().trim().min(1, "Enter a role").max(120, "Keep the role under 120 characters"),
  bio: optionalText(1200),
  photo: optionalUrl,
  sortOrder: z.coerce.number().int().min(0).max(999),
  active: z.coerce.boolean(),
});

export const enquiryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your name")
    .max(120, "Keep your name under 120 characters"),
  email: z.email("Enter an email address we can reply to").max(200),
  phone: z
    .string()
    .trim()
    .max(40, "Keep the phone number under 40 characters")
    .optional()
    .transform((value) => (value ? value : null)),
  topic: z
    .string()
    .trim()
    .max(160, "Keep the topic under 160 characters")
    .optional()
    .transform((value) => (value ? value : null)),
  message: z
    .string()
    .trim()
    .min(10, "Add a little more detail, at least 10 characters")
    .max(4000, "Keep the message under 4000 characters"),
  // Bots fill in every field they find. This one stays empty for people.
  website: z.string().max(0, "This submission was rejected").optional(),
});

export const siteSettingsFormSchema = z.object({
  name: z.string().trim().min(1, "Enter the business name").max(160),
  tagline: z.string().trim().max(200, "Keep the tagline under 200 characters"),
  phone: z
    .string()
    .trim()
    .max(40, "Keep the phone number under 40 characters")
    .optional()
    .transform((value) => (value ? value : null)),
  email: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((value) => (value ? value : null))
    .refine(
      (value) => value === null || z.email().safeParse(value).success,
      "Enter a valid email address",
    ),
  whatsapp: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((value) => (value ? value : null)),
  addressLines: z
    .array(z.string().trim().max(160, "Keep each address line under 160 characters"))
    .max(6, "Six address lines is the limit"),
  hours: z.string().trim().max(200, "Keep the hours under 200 characters"),
  logoUrl: optionalUrl,
  socials: z
    .array(
      z.object({
        label: z.string().trim().min(1, "Enter a label").max(40),
        url: optionalUrl,
      }),
    )
    .max(8, "Eight social links is the limit"),
});

export const homeSettingsFormSchema = z.object({
  heroTitle: z.string().trim().max(200, "Keep the hero title under 200 characters"),
  heroIntro: z.string().trim().max(600, "Keep the hero intro under 600 characters"),
  servicesHeading: z.string().trim().max(200, "Keep the heading under 200 characters"),
  agencyHeading: z.string().trim().max(200, "Keep the heading under 200 characters"),
  closingHeading: z.string().trim().max(200, "Keep the heading under 200 characters"),
});

export const mediaAltFormSchema = z.object({
  id: z.string().uuid(),
  alt: z
    .string()
    .trim()
    .max(200, "Keep the description under 200 characters")
    .optional()
    .transform((value) => (value ? value : null)),
});

export const inviteUserFormSchema = z.object({
  email: z.email("Enter a valid email address"),
  fullName: z.string().trim().max(120, "Keep the name under 120 characters"),
  role: z.enum(["admin", "editor"]),
});

export const roleFormSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["admin", "editor"]),
});

export const loginFormSchema = z.object({
  email: z.email("Enter your email address"),
  password: z.string().min(1, "Enter your password").max(200),
});

export const mediaUploadSchema = z.object({
  path: z
    .string()
    .trim()
    .regex(
      /^[a-z0-9][a-z0-9\-._/]*\.(jpe?g|png|webp|svg)$/,
      "Only jpeg, png, webp and svg files are allowed",
    ),
  url: optionalUrl,
  alt: optionalText(200),
  sizeBytes: z
    .number()
    .int()
    .positive("The file is empty")
    .max(5 * 1024 * 1024, "Images must be 5 MB or smaller"),
});

export const allowedMediaTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
] as const;
