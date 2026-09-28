import type {
  FaqRow,
  PageRow,
  ServiceRow,
  TeamMemberRow,
} from "@/lib/database.types";
import { defaultHomeSettings, defaultSiteSettings } from "@/lib/content/settings";

/**
 * Mirrors supabase/seed.sql. Used only while no Supabase project is connected,
 * so the site can be reviewed locally before the database exists. Once the
 * project is connected every query goes to Postgres instead.
 */

const now = "1970-01-01T00:00:00.000Z";

export const fallbackSiteSettings = {
  ...defaultSiteSettings,
  addressLines: ["Pantang Shalom Junction, Accra, Ghana", "P.O. Box AF 1921, Adenta, Ghana"],
};

export const fallbackHomeSettings = {
  heroTitle: "We build people, plan solutions and create value.",
  heroIntro:
    "Construction, real estate, human resources and business consultancy for individuals and organisations across Ghana.",
  servicesHeading: "Three practices, one accountable team.",
  agencyHeading:
    "Buy, sell or rent property and vehicles through people who handle the paperwork.",
  closingHeading: "Tell us what you are planning.",
};

function service(
  id: string,
  kind: "practice" | "agency",
  title: string,
  slug: string,
  summary: string,
  scope: string[],
  sortOrder: number,
): ServiceRow {
  return {
    id,
    kind,
    title,
    slug,
    summary,
    scope,
    body: null,
    image: null,
    sort_order: sortOrder,
    active: true,
    created_at: now,
    updated_at: now,
  };
}

export const fallbackServices: ServiceRow[] = [
  service(
    "practice-construction",
    "practice",
    "Construction and real estate",
    "construction-and-real-estate",
    "Practical, professional construction and real estate solutions, planned properly and delivered dependably.",
    ["Construction", "Real estate"],
    1,
  ),
  service(
    "practice-hr",
    "practice",
    "Human resources management",
    "human-resources-management",
    "Human resources support that helps organisations recruit, manage and look after the people who do the work.",
    ["Human resources management"],
    2,
  ),
  service(
    "practice-consultancy",
    "practice",
    "Consultancy",
    "consultancy",
    "Practical advice on staying compliant and on making sound financial and business decisions.",
    ["Labour compliance and inspection readiness", "Budgeting, finance and business advisory"],
    3,
  ),
  service(
    "agency-property",
    "agency",
    "Property sales, rentals and agency",
    "property-sales-and-rentals",
    "Buy, sell or rent with us as the people in the middle, from the first conversation to the paperwork.",
    ["Land", "Houses", "Commercial property", "Apartments", "Rooms"],
    1,
  ),
  service(
    "agency-automobile",
    "agency",
    "Automobile sales and agency",
    "automobile-sales-and-agency",
    "Buy or sell a car with us sourcing the vehicle and bringing buyers and sellers together.",
    ["Cars", "Vehicle sourcing", "Buyer and seller coordination"],
    2,
  ),
];

const aboutContent = {
  type: "doc",
  content: [
    heading(2, "Who we are"),
    paragraph(
      "Deusy & Planners Services is a multidisciplinary Ghanaian business. We build people, plan solutions and create value.",
    ),
    heading(2, "What we do"),
    paragraph("We work across three practices and two agency services."),
    bulletList([
      "Construction and real estate.",
      "Human resources management.",
      "Consultancy, covering labour compliance and inspection readiness, and budgeting, finance and business advisory.",
      "Property sales, rentals and agency for land, houses, commercial property, apartments and rooms.",
      "Automobile sales and agency, covering cars, vehicle sourcing and buyer and seller coordination.",
    ]),
    heading(2, "Our mission"),
    paragraph(
      "To provide reliable, practical and professional construction, real estate, human resources and consultancy solutions that create value for our clients and contribute to sustainable business development.",
    ),
    heading(2, "Our vision"),
    paragraph(
      "To become a trusted and respected Ghanaian service provider in construction, real estate, human resources and business consultancy, recognised for professionalism, integrity, efficiency and client-focused solutions.",
    ),
    heading(2, "Our values"),
    bulletList([
      "Integrity",
      "Professionalism",
      "Reliability",
      "Accountability",
      "Excellence",
      "Client satisfaction",
    ]),
    heading(2, "What you can expect"),
    {
      type: "blockquote",
      content: [
        paragraph(
          "Every client deserves practical advice, proper planning and dependable service. We work closely with clients to understand their needs and provide solutions that are efficient, transparent and results-oriented.",
        ),
      ],
    },
  ],
};

function heading(level: 2 | 3, text: string) {
  return {
    type: "heading",
    attrs: { level },
    content: [{ type: "text", text }],
  };
}

function paragraph(text: string) {
  return { type: "paragraph", content: [{ type: "text", text }] };
}

function bulletList(items: string[]) {
  return {
    type: "bulletList",
    content: items.map((text) => ({
      type: "listItem",
      content: [paragraph(text)],
    })),
  };
}

function page(
  id: string,
  title: string,
  slug: string,
  subtitle: string,
  template: PageRow["template"],
  content: PageRow["content"],
  navOrder: number,
): PageRow {
  return {
    id,
    title,
    slug,
    subtitle,
    template,
    content,
    published: true,
    show_in_nav: true,
    nav_label: null,
    nav_order: navOrder,
    seo_title: null,
    seo_desc: null,
    og_image: null,
    created_at: now,
    updated_at: now,
  };
}

export const fallbackPages: PageRow[] = [
  page(
    "page-about",
    "About",
    "about",
    "Who we are and how we work.",
    "standard",
    aboutContent,
    1,
  ),
  page(
    "page-faq",
    "FAQ",
    "faq",
    "Straight answers to the questions we are asked most.",
    "faq",
    {
      type: "doc",
      content: [
        paragraph(
          "These are the questions we are asked most. If your question is not answered here, send it to us through the contact page and we will answer it directly.",
        ),
      ],
    },
    2,
  ),
  page(
    "page-contact",
    "Contact",
    "contact",
    "Tell us what you are planning.",
    "contact",
    {
      type: "doc",
      content: [
        paragraph(
          "Tell us what you are planning and we will take it from there. Give us a short description of the property, the vehicle or the business problem you are dealing with, and the team will come back to you.",
        ),
      ],
    },
    3,
  ),
];

function faq(id: string, question: string, answer: string, sortOrder: number): FaqRow {
  return { id, question, answer, sort_order: sortOrder, active: true };
}

export const fallbackFaqs: FaqRow[] = [
  faq(
    "faq-1",
    "What does Deusy & Planners Services do?",
    "We work across construction and real estate, human resources management, and consultancy, where consultancy covers labour compliance and inspection readiness as well as budgeting, finance and business advisory. We also act as agents for property sales and rentals, and for automobile sales.",
    1,
  ),
  faq(
    "faq-2",
    "Who do you work with?",
    "Individuals and organisations across Ghana. That includes people buying, selling or renting property, people looking for a vehicle, and businesses that need construction, real estate, human resources or consultancy support.",
    2,
  ),
  faq(
    "faq-3",
    "How does your property service work?",
    "We act as the agent between the two sides. We handle land, houses, commercial property, apartments and rooms, for sale and for rent, and we take care of the coordination and the paperwork around the transaction. The contact page is the fastest way to start.",
    3,
  ),
  faq(
    "faq-4",
    "How does your automobile service work?",
    "We source the vehicle and bring buyers and sellers together so the deal moves through one point of contact instead of several. Start on the contact page with the make and model you are looking for, or the vehicle you are selling.",
    4,
  ),
  faq(
    "faq-5",
    "How do I start a consultation?",
    "Use the contact page. Choose the topic that matches your need, describe the situation in your own words and send it. The enquiry reaches the team directly and someone will pick it up from there.",
    5,
  ),
  faq(
    "faq-6",
    "Where are you based?",
    "We are at Pantang Shalom Junction, Accra, Ghana, and our postal address is P.O. Box AF 1921, Adenta, Ghana.",
    6,
  ),
  faq(
    "faq-7",
    "What does your human resources practice cover?",
    "Human resources management for organisations that need support with the people side of running a business. The contact page is the quickest way to describe what your team needs.",
    7,
  ),
  faq(
    "faq-8",
    "What do you stand for?",
    "Integrity, professionalism, reliability, accountability, excellence and client satisfaction. Those values shape how we take on work and how we report back to the people who trust us with it.",
    8,
  ),
];

export const fallbackTeam: TeamMemberRow[] = [];
