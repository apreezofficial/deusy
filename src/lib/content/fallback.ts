import type {
  BlogPostRow,
  FaqRow,
  PageRow,
  ServiceRow,
  TeamMemberRow,
} from "@/lib/database.types";
import { defaultSiteSettings } from "@/lib/content/settings";

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
    "Construction and real estate, human resources management, business consultancy, and agency services for individuals, businesses, institutions and organisations across Ghana.",
  servicesHeading: "Three practices, one accountable team.",
  agencyHeading:
    "Property, vehicles and business facilitation, handled by people who keep the paperwork moving.",
  closingHeading: "Tell us what you are planning.",
  processHeading: "How we work",
  processIntro:
    "The same four steps on every job, whether it is a building project, a compliance inspection or a property purchase.",
  processSteps: [
    {
      title: "You send the detail",
      text: "A phone call, an email or the contact form. What you need, where you are and what is in the way.",
    },
    {
      title: "We scope it in writing",
      text: "You get a clear scope of the work, what it covers, what it costs and how long it takes. No surprises later.",
    },
    {
      title: "We do the work",
      text: "The project is supervised, the documents are prepared, the training is delivered, and you hear from us as it happens.",
    },
    {
      title: "We report and hand over",
      text: "A plain report of what was done, what is outstanding and what you should do next, with the paperwork in order.",
    },
  ],
};

function service(
  id: string,
  kind: "practice" | "agency",
  title: string,
  slug: string,
  summary: string,
  scope: string[],
  body: PageRow["content"],
  sortOrder: number,
  image: string | null = null,
): ServiceRow {
  return {
    id,
    kind,
    title,
    slug,
    summary,
    scope,
    body,
    image,
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
    "Building and construction services, project planning and coordination, property development and management support, real estate consultancy and project supervision.",
    [
      "Building and construction services",
      "Project planning and coordination",
      "Property development support",
      "Property management",
      "Real estate consultancy",
      "Land and property advisory",
      "Project supervision",
    ],
    {
      type: "doc",
      content: [
        heading(2, "What we deliver"),
        paragraph(
          "We provide practical solutions across construction, property development and real estate, planned properly and supervised properly.",
        ),
        bulletList([
          "Building and construction services",
          "Construction project planning and coordination",
          "Property development and management support",
          "Real estate consultancy",
          "Building and construction advisory",
          "Project supervision and general construction support",
        ]),
        heading(2, "How we work"),
        paragraph(
          "Every project starts with the site, the drawings and the money. We plan the sequence of work, coordinate the people on site, keep the documentation in order and report progress honestly, so the client knows where the project stands at any point.",
        ),
        heading(2, "Property development and management"),
        paragraph(
          "For clients who are developing or holding property, we support the work around the building: development decisions, management of the property, and the advisory that keeps value from leaking away through neglect or poor records.",
        ),
      ],
    },
    1,
    "/images/practice-construction.jpg"
  ),
  service(
    "practice-hr",
    "practice",
    "Human resources management",
    "human-resources-management",
    "Recruitment, employee management, HR policies, staff training, performance management and workplace relations support for organisations.",
    [
      "Recruitment and staffing support",
      "Employee management",
      "HR policies and procedures",
      "Staff training and development",
      "Performance management",
      "Employee documentation",
      "Workplace relations advisory",
      "HR compliance support",
    ],
    {
      type: "doc",
      content: [
        heading(2, "Our people service"),
        paragraph(
          "Our human resources services support organisations in effectively managing their workforce. The work is practical: the policies, the records and the day-to-day handling of the people side of running a business.",
        ),
        bulletList([
          "Recruitment and staffing support",
          "Employee management",
          "HR policy development",
          "Staff training and development",
          "Performance management support",
          "Employee documentation",
          "Workplace relations advisory",
          "HR compliance support",
        ]),
        heading(2, "Compliance and documentation"),
        paragraph(
          "Good human resources management is also compliance management. We build the documentation an organisation needs to survive an inspection, keep employee records that are actually usable, and put policies in place that staff can follow.",
        ),
        heading(2, "Who we support"),
        paragraph(
          "Small and growing businesses, NGOs, churches and institutions that need a functioning people function but do not yet have a full human resources department.",
        ),
      ],
    },
    2,
    "/images/practice-hr.jpg"
  ),
  service(
    "practice-consultancy",
    "practice",
    "Consultancy",
    "consultancy",
    "Training, inspection readiness and labour compliance, plus budgeting, finance, human resources and general business advisory.",
    [
      "Labour compliance advisory",
      "Inspection-readiness training",
      "Workplace documentation",
      "Staff orientation and compliance training",
      "Budgeting and financial planning",
      "Finance and cost-management advisory",
      "Business planning",
      "General management consultancy",
      "Business growth and development support",
    ],
    {
      type: "doc",
      content: [
        heading(2, "Training, inspection readiness and labour compliance"),
        paragraph(
          "We assist businesses and organisations to prepare for inspections and improve compliance with applicable labour requirements.",
        ),
        bulletList([
          "Labour compliance advisory",
          "Inspection-readiness training",
          "Workplace documentation and compliance preparation",
          "Human resources policies and procedures",
          "Employee records and documentation",
          "Workplace practices assessment",
          "Compliance training and staff orientation",
        ]),
        heading(2, "Budgeting, finance, human resources and general business advisory"),
        paragraph(
          "We provide practical business advisory services that help an organisation plan its money, manage its people and run its operations properly.",
        ),
        bulletList([
          "Business budgeting and financial planning",
          "Budget preparation and monitoring",
          "Basic financial management advisory",
          "Human resources management",
          "Staff planning and organisational development",
          "Business planning",
          "Business operations advisory",
          "General management consultancy",
          "Business improvement and growth strategies",
        ]),
        heading(2, "How a consultancy engagement runs"),
        numberedList([
          "A short conversation about the business and what is actually in the way.",
          "A written scope, so both sides know what is included.",
          "The work: documents, training, plans, reviews and follow-up.",
          "A plain report of what was done and what to do next.",
        ]),
      ],
    },
    3,
    "/images/practice-consultancy.jpg"
  ),
  service(
    "agency-property",
    "agency",
    "Property sales, rentals and agency",
    "property-sales-and-rentals",
    "Professional property agency and brokerage for clients looking to buy, sell, rent or manage land, houses, commercial property, apartments and rooms.",
    [
      "Land",
      "Houses for sale and rent",
      "Commercial property",
      "Apartments and rooms",
      "Property searches and sourcing",
      "Landlord and owner support",
    ],
    {
      type: "doc",
      content: [
        heading(2, "Land"),
        bulletList([
          "Land sales and acquisition support",
          "Land sourcing",
          "Property searches",
          "Buyer and seller coordination",
          "Land transaction facilitation",
          "Property documentation support",
        ]),
        heading(2, "Houses and buildings"),
        bulletList([
          "Houses for sale",
          "Houses for rent",
          "Commercial properties",
          "Apartments and rooms",
          "Property sourcing and viewing coordination",
          "Buyer and tenant representation",
          "Landlord and property owner support",
        ]),
        heading(2, "How we work as agents"),
        paragraph(
          "We connect property owners, buyers, landlords and prospective tenants, and we support the transaction process with proper documentation and professional coordination. One point of contact, from the first viewing to the paperwork.",
        ),
      ],
    },
    1,
    "/images/agency-property.jpg"
  ),
  service(
    "agency-automobile",
    "agency",
    "Automobile sales and agency",
    "automobile-sales-and-agency",
    "Cars, vehicle sourcing and buyer and seller agency for individuals and businesses, including corporate and personal vehicle sourcing.",
    [
      "Cars for sale",
      "Vehicle sourcing",
      "Buyer and seller agency",
      "Vehicle marketing",
      "Inspection and documentation support",
      "Negotiation and transaction coordination",
    ],
    {
      type: "doc",
      content: [
        heading(2, "Our services"),
        bulletList([
          "Cars for sale",
          "Vehicle sourcing",
          "Buyer and seller agency",
          "Vehicle sales facilitation",
          "Vehicle advertising and marketing",
          "Assistance with vehicle inspection and documentation",
          "Corporate and personal vehicle sourcing",
          "Negotiation and transaction coordination",
        ]),
        heading(2, "Our role"),
        paragraph(
          "We help clients find suitable vehicles and facilitate communication and transactions between buyers and vehicle owners or sellers. You tell us the make, model and budget; we do the searching and the dealing.",
        ),
      ],
    },
    2,
    "/images/agency-automobile.jpg"
  ),
  service(
    "agency-facilitation",
    "agency",
    "General agency and business facilitation",
    "general-agency-and-business-facilitation",
    "Connecting clients with suitable contractors, professionals, suppliers and business opportunities, with proper coordination from start to finish.",
    [
      "Contractor sourcing",
      "Professional referrals",
      "Supplier connections",
      "Business opportunities",
      "Facilitation and coordination",
    ],
    {
      type: "doc",
      content: [
        heading(2, "What we facilitate"),
        paragraph(
          "General agency and business facilitation means putting the right client in front of the right counterparty, and keeping the process moving. We connect clients with suitable properties, vehicles, contractors, professionals, suppliers and business opportunities.",
        ),
        bulletList([
          "Contractors and service providers for building and maintenance work",
          "Professionals for accounting, legal, engineering and advisory work",
          "Suppliers for materials, equipment and office needs",
          "Business opportunities, partnerships and introductions",
          "Facilitation, follow-up and coordination between the parties",
        ]),
        heading(2, "How our approach works"),
        paragraph(
          "Every facilitation is built on trust, transparency, professionalism, proper coordination and client satisfaction. We introduce both sides, we stay involved until the arrangement is settled, and we keep the record of what was agreed.",
        ),
      ],
    },
    3,
    "/images/agency-facilitation.jpg"
  ),
];

const aboutContent = {
  type: "doc",
  content: [
    heading(2, "Who we are"),
    paragraph(
      "Deusy Investments Services is a multidisciplinary business providing construction and real estate, human resources management, and business consultancy services to individuals, businesses, institutions and organisations.",
    ),
    paragraph(
      "Our goal is to provide practical, professional and reliable solutions that help our clients plan effectively, comply with applicable requirements, manage resources efficiently, and achieve sustainable business growth.",
    ),
    heading(2, "Our core services"),
    heading(3, "Construction and real estate"),
    paragraph("We provide services in the construction and real estate sector, including:"),
    bulletList([
      "Building and construction services",
      "Construction project planning and coordination",
      "Property development and management support",
      "Real estate consultancy",
      "Building and construction advisory",
      "Project supervision and general construction support",
    ]),
    heading(3, "Consultancy services"),
    paragraph(
      "We provide professional consultancy and advisory services in two areas: training, inspection readiness and labour compliance; and budgeting, finance, human resources and general business advisory.",
    ),
    heading(3, "Human resources management"),
    paragraph(
      "Our human resources services support organisations in effectively managing their workforce, from recruitment and staffing to policies, training, performance management and workplace relations.",
    ),
    heading(3, "Agency services"),
    paragraph(
      "Alongside the practices we run property sales, rentals and agency, automobile sales and agency, and general agency and business facilitation.",
    ),
    heading(2, "Our mission"),
    paragraph(
      "To provide reliable, practical, and professional construction, real estate, human resources, and consultancy solutions that create value for our clients and contribute to sustainable business development.",
    ),
    heading(2, "Our vision"),
    paragraph(
      "To become a trusted and respected Ghanaian service provider in construction, real estate, human resources, and business consultancy, recognized for professionalism, integrity, efficiency, and client-focused solutions.",
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
    heading(2, "Our service promise"),
    {
      type: "blockquote",
      content: [
        paragraph(
          "At Deusy Investments Services, we believe that every client deserves practical advice, proper planning, and dependable service. We work closely with our clients to understand their needs and provide solutions that are efficient, transparent, and results-oriented.",
        ),
      ],
    },
  ],
};

const teamContent = {
  type: "doc",
  content: [
    heading(2, "Our people"),
    paragraph(
      "Deusy Investments Services is run by people who have spent their careers in finance, administration, human resources, business development, real estate and education. The profiles below are the people clients deal with directly.",
    ),
    heading(2, "How we are structured"),
    paragraph(
      "One managing director sets the direction. Three managers, administration, finance and liaison, carry the day-to-day work. Under them sit the service lines: construction and real estate, human resources, and consultancy, alongside the agency services.",
    ),
    heading(3, "Managing Director"),
    paragraph(
      "Overall leadership, strategy and business performance. Sets the vision and objectives, supervises all departments and senior staff, approves major projects, contracts and budgets, develops relationships with clients, investors, contractors and institutions, identifies new business and investment opportunities, and ensures the company complies with applicable laws, regulations and professional standards.",
    ),
    heading(3, "Administrator"),
    paragraph(
      "Day-to-day administrative operations. Maintains company records, correspondence, files and official documents, coordinates office activities and schedules, prepares agendas, minutes, reports and letters, supports recruitment, onboarding, attendance and employee records, coordinates meetings between management, staff, clients and service providers, and assists the managing director and managers in implementing company decisions.",
    ),
    heading(3, "Finance Manager"),
    paragraph(
      "Financial management, budgeting, controls and reporting. Prepares and manages annual and project budgets, monitors income, expenditure, cash flow and financial commitments, maintains accurate financial records, prepares management accounts and financial reports, monitors project costs, prepares quotations, invoices and payment schedules, monitors receivables and payables, establishes financial controls to protect company funds and assets, and coordinates with accountants, auditors, banks, suppliers and relevant authorities.",
    ),
    heading(3, "Liaison Manager"),
    paragraph(
      "Coordination between the company, clients, government agencies, contractors, consultants and other stakeholders. Serves as the key communication link to external parties, follows up on permits, approvals, registrations, inspections and official correspondence, assists with labour and workplace inspection-readiness activities, coordinates meetings and appointments with external stakeholders, monitors outstanding requests and approvals, and resolves communication and coordination problems before they cost the company a project.",
    ),
  ],
};

const legalIndexContent = {
  type: "doc",
  content: [
    paragraph(
      "This section covers how we handle your information, what this site stores on your device, and the terms that apply when you use this site or work with us.",
    ),
    bulletList([
      "Cookie policy: what is stored on your device, and what is not.",
      "Privacy policy: what we collect when you send an enquiry, and what we do with it.",
      "Terms and conditions: the terms that apply when you use this site or engage our services.",
    ]),
    paragraph(
      "If anything here is unclear, send us a message through the contact page and we will explain it in plain language.",
    ),
  ],
};

const cookiePolicyContent = {
  type: "doc",
  content: [
    heading(2, "What this site stores"),
    paragraph(
      "This site does not use advertising cookies, tracking pixels or third-party analytics. There is nothing on this site that follows you around the internet.",
    ),
    heading(3, "Essential storage"),
    bulletList([
      "Your cookie choice: whether you dismissed the cookie box, kept on your own device so the box does not reappear on every page.",
      "Sign-in cookies: if you are signed in to the admin panel, cookies keep that session alive so you stay signed in while you work.",
    ]),
    heading(2, "What we do not do"),
    paragraph(
      "We do not sell data, we do not run advertising campaigns on this site, and we do not embed third-party trackers, social media widgets or map services that would report your visit to another company.",
    ),
    heading(2, "Managing your choice"),
    paragraph(
      "The cookie box appears once. If you clear your browser storage for this site, the box will appear again and you can choose differently. To remove the sign-in cookies, sign out of the admin panel and close the browser.",
    ),
    heading(3, "Contact"),
    paragraph(
      "Questions about cookies can be sent through the contact page. We will explain what is stored and why, in writing.",
    ),
  ],
};

const privacyPolicyContent = {
  type: "doc",
  content: [
    heading(2, "What we collect"),
    paragraph(
      "We only collect what you choose to give us. When you send an enquiry through this site we receive the name, email address, optional phone number, the topic you selected and the message you wrote. We also receive the date the enquiry arrived and whether it has been read.",
    ),
    heading(2, "Why we collect it"),
    bulletList([
      "To answer your enquiry and give you a considered response.",
      "To keep a record of what was agreed, so we do not rely on memory.",
      "To meet our record-keeping and professional obligations.",
    ]),
    heading(2, "What we do not do"),
    paragraph(
      "We do not sell your details, we do not pass them to advertisers or data brokers, and we do not add you to a marketing list because you asked a question.",
    ),
    heading(2, "How long we keep it"),
    paragraph(
      "Enquiry records are kept for as long as they are useful for the matter they relate to, and for as long as our professional and legal record-keeping obligations require. You can ask us to delete an enquiry at any time, and we will do so unless we are required to keep it.",
    ),
    heading(2, "Who can see it"),
    paragraph(
      "Only the people at Deusy Investments Services who need it to handle your matter. Where a project involves contractors, consultants or authorities, we share only what the work requires, and we tell you when we do.",
    ),
    heading(2, "Your rights"),
    paragraph(
      "You can ask what we hold about you, ask for a correction, or ask for it to be deleted. Send the request through the contact page and we will deal with it in writing.",
    ),
  ],
};

const termsContent = {
  type: "doc",
  content: [
    heading(2, "About this site"),
    paragraph(
      "This site is published by Deusy Investments Services to describe our services and to let you start a conversation with us. The content is general information. It is not professional advice on your specific situation, and reading it does not create a client or consultant relationship.",
    ),
    heading(2, "Starting work with us"),
    paragraph(
      "Sending an enquiry does not commit either of us. Work begins when we agree a scope in writing, confirm what it covers, what it costs and how long it takes, and both sides are satisfied with that.",
    ),
    heading(2, "Accuracy"),
    paragraph(
      "We take care to keep this site accurate and up to date, but services, fees and availability change. Confirm anything that matters to your decision with us directly before you act on it.",
    ),
    heading(2, "Intellectual property"),
    paragraph(
      "The text, layout, drawings and logo on this site belong to Deusy Investments Services. You may read it, print it and share the link. You may not copy substantial parts of it or reuse our drawings as your own.",
    ),
    heading(2, "Third-party links"),
    paragraph(
      "Where we link to another website, we do not control it and we are not responsible for what is published there.",
    ),
    heading(2, "Governing law"),
    paragraph(
      "These terms are governed by the laws of the Republic of Ghana, and the courts of Ghana have jurisdiction over any dispute arising from them.",
    ),
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

function numberedList(items: string[]) {
  return {
    type: "orderedList",
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
    "Who we are, what we do, and how we work.",
    "standard",
    aboutContent,
    1,
  ),
  page(
    "page-team",
    "Our team",
    "team",
    "The people behind the work, and how the company is structured.",
    "standard",
    teamContent,
    2,
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
    3,
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
    4,
  ),
  legalPage("page-legal", "Legal", "legal", legalIndexContent, 5),
  legalPage(
    "page-cookie-policy",
    "Cookie policy",
    "cookie-policy",
    cookiePolicyContent,
    6,
  ),
  legalPage(
    "page-privacy-policy",
    "Privacy policy",
    "privacy-policy",
    privacyPolicyContent,
    7,
  ),
  legalPage("page-terms", "Terms and conditions", "terms", termsContent, 8),
];

/** Legal pages sit outside the main navigation, which links to them directly. */
function legalPage(
  id: string,
  title: string,
  slug: string,
  content: PageRow["content"],
  navOrder: number,
): PageRow {
  const row = page(id, title, slug, "", "standard", content, navOrder);
  return { ...row, show_in_nav: false };
}

function faq(id: string, question: string, answer: string, sortOrder: number): FaqRow {  return { id, question, answer, sort_order: sortOrder, active: true };
}

export const fallbackFaqs: FaqRow[] = [
  faq(
    "faq-1",
    "What does Deusy Investments Services do?",
    "We are a multidisciplinary business providing construction and real estate, human resources management, and business consultancy services, alongside property sales, rentals and agency, automobile sales and agency, and general agency and business facilitation.",
    1,
  ),
  faq(
    "faq-2",
    "Who do you work with?",
    "Individuals, businesses, institutions and organisations across Ghana. That includes people buying, selling or renting property, people looking for a vehicle, and organisations that need construction, real estate, human resources or consultancy support.",
    2,
  ),
  faq(
    "faq-3",
    "What does your construction and real estate practice cover?",
    "Building and construction services, construction project planning and coordination, property development and management support, real estate consultancy, building and construction advisory, and project supervision and general construction support.",
    3,
  ),
  faq(
    "faq-4",
    "What does your consultancy practice cover?",
    "Two areas. First, training, inspection readiness and labour compliance, covering labour compliance advisory, inspection-readiness training, workplace documentation, HR policies and procedures, employee records and staff orientation. Second, budgeting, finance, human resources and general business advisory, covering budgeting and financial planning, financial management advisory, business planning, operations advisory, general management consultancy and business growth strategies.",
    4,
  ),
  faq(
    "faq-5",
    "What does your human resources practice cover?",
    "Recruitment and staffing support, employee management, HR policy development, staff training and development, performance management support, employee documentation, workplace relations advisory and HR compliance support.",
    5,
  ),
  faq(
    "faq-6",
    "How does your property service work?",
    "We act as the agent between the two sides, covering land, houses, commercial property, apartments and rooms, for sale and for rent. We handle property searches, sourcing, viewing coordination, negotiation, transaction facilitation and the documentation around the deal.",
    6,
  ),
  faq(
    "faq-7",
    "How does your automobile service work?",
    "We source the vehicle and bring buyers and sellers together so the deal moves through one point of contact instead of several. Start on the contact page with the make, model and budget you are working with, or the vehicle you are selling. We also handle vehicle marketing, inspection and documentation support, and negotiation.",
    7,
  ),
  faq(
    "faq-8",
    "What is general agency and business facilitation?",
    "It is the work of connecting clients with suitable contractors, professionals, suppliers and business opportunities, and then coordinating the arrangement properly. We introduce both sides, stay involved until it is settled, and keep the record of what was agreed.",
    8,
  ),
  faq(
    "faq-9",
    "How do I start a consultation?",
    "Use the contact page. Choose the topic that matches your need, describe the situation in your own words and send it. The enquiry reaches the team directly and someone will pick it up from there.",
    9,
  ),
  faq(
    "faq-10",
    "Can you help with labour inspection readiness?",
    "Yes. We prepare workplaces for inspections by reviewing labour compliance, building the required workplace documentation, putting HR policies and procedures in place, organising employee records and running compliance training and staff orientation.",
    10,
  ),
  faq(
    "faq-11",
    "Who will be working on my project?",
    "Our people. The company is led by a managing director, supported by an administrator, a finance manager and a liaison manager, and organised around our three practices: construction and real estate, human resources, and consultancy. You can read the profiles on the team page.",
    11,
  ),
  faq(
    "faq-12",
    "Where are you based?",
    "We are at Pantang Shalom Junction, Accra, Ghana, and our postal address is P.O. Box AF 1921, Adenta, Ghana.",
    12,
  ),
  faq(
    "faq-13",
    "What do you stand for?",
    "Integrity, professionalism, reliability, accountability, excellence and client satisfaction. Our service promise is simple: every client deserves practical advice, proper planning and dependable service, delivered efficiently, transparently and with results in mind.",
    13,
  ),
];

export const fallbackTeam: TeamMemberRow[] = [
  {
    id: "team-m-director",
    name: "Eric Semanu-Uzziah Dornyo",
    slug: "eric-semanu-uzziah-dornyo",
    role: "Managing Director",
    summary:
      "Entrepreneur and business development consultant with over 20 years across banking, microfinance, real estate and strategic planning.",
    bio: "Results-oriented entrepreneur, marketing and business development professional, financial services practitioner and consultant with over 20 years of experience spanning microfinance, sales and marketing, real estate, entrepreneurship, business consultancy and strategic planning. He holds a degree in marketing, a postgraduate certificate in banking and finance, a professional certificate in stock market practice and a certificate in real estate development, alongside a diploma in theology. His career includes direct sales at Barclays Bank Ghana and co-founding Besworth Investments Services and Barak Deusy Services. He advises businesses, NGOs and churches on growth, structure and opportunity, and works on the principle that there is an opportunity in every difficult situation.",
    photo: "/images/profile-2.jpg",
    sort_order: 1,
    active: true,
  },
  {
    id: "team-finance-admin",
    name: "Raphael Cameron Etse",
    slug: "raphael-cameron-etse",
    role: "Finance, Administration and Operations Manager",
    summary:
      "Finance and administration leader with 20+ years across United Nations operations and private sector management in Ghana.",
    bio: "Ghanaian finance, administration and operations leader with more than 20 years of progressive experience bridging international humanitarian operations and private sector management. He spent eight years with the United Nations as Administrative and Finance Officer with OCHA, Finance Officer with ONUCI in Côte d'Ivoire and UNMIK Kosovo, and Assistant Admin and Finance Officer with UNESCO, supervising finance, human resources, logistics, procurement, travel and general administration for missions of over 160 national and international staff across 15 field duty stations. He prepared and managed annual cost plans from 2010 to 2017, established internal controls that achieved full compliance, led the deployment of the UN Secretariat ERP in Niger in 2015, and delivered measurable efficiencies including monthly savings in the Democratic Republic of the Congo and debt recovery in Chad. He coordinated administrative operations for the L3 emergency response in the Central African Republic in 2014 and led the full closure and liquidation of OCHA offices in Uganda and Zimbabwe. Since January 2019 he has been finance and administrative manager at Deusy Investment Services Ltd in Ghana, leading financial management, budgeting, cash flow forecasting, contractor and procurement management and full human resources operations for a construction and real estate portfolio, and he leads the firm's business consultancy practice. He is fluent in English and French.",
    photo: "/images/profile-1.jpg",
    sort_order: 2,
    active: true,
  },
  {
    id: "team-liaison",
    name: "Courage Sena Kwame Godzo",
    slug: "courage-sena-kwame-godzo",
    role: "French Instructor, Educator and Community Development Advocate",
    summary:
      "French instructor and educator with 20+ years of teaching experience, focused on language, youth empowerment and community development.",
    bio: "An experienced French instructor with over 20 years of professional teaching experience and a Diplôme Universitaire des Études Françaises from the Centre Béninois des Langues Étrangères, Cotonou. He also pursued a degree in French and Information Studies at the University of Ghana, Legon. Courage is passionate about education, language development, youth empowerment, leadership and community development, and has dedicated his career to helping learners develop real French language and communication skills while promoting cultural understanding and academic excellence. His interests extend to educational advocacy, public communication, community development, entrepreneurship and leadership, and he is committed to using his experience, knowledge and leadership to inspire individuals, strengthen communities and create opportunities for sustainable development.",
    photo: null,
    sort_order: 3,
    active: true,
  },
];

export const fallbackPosts: BlogPostRow[] = [
  {
    id: "post-1",
    title: "Key Considerations Before Buying Land in Accra, Ghana",
    slug: "key-considerations-before-buying-land-in-accra-ghana",
    excerpt:
      "Navigating title searches, zoning restrictions, site inspection, and transaction coordination when acquiring real estate in Ghana.",
    category: "Real Estate & Construction",
    author: "Eric Semanu-Uzziah Dornyo",
    cover_image: "/images/agency-property.jpg",
    published: true,
    published_at: "2026-09-15T09:00:00.000Z",
    created_at: now,
    updated_at: now,
    content: {
      type: "doc",
      content: [
        heading(2, "Due Diligence Is Non-Negotiable"),
        paragraph(
          "Acquiring property in Ghana, especially in Greater Accra and developing peri-urban zones, demands thorough verification. From stool land demarcations to family titles, prospective purchasers must ensure official site plans match ground realities.",
        ),
        heading(2, "1. Site Plan Validation and Cadastral Searches"),
        paragraph(
          "Never rely solely on photocopied indentures. A verified surveyor must pick site coordinates to run a search at the Lands Commission Survey & Mapping and Land Registration divisions.",
        ),
        bulletList([
          "Verification of registry records against physical beacons",
          "Zoning validation with local municipal planning assemblies",
          "Confirming encumbrances, court caveats, and historical litigation",
        ]),
        heading(2, "2. Engaging Professional Coordination"),
        paragraph(
          "At Deusy Investments Services, our property agency and consultancy teams bridge prospective buyers and verified owners, conducting preliminary investigations before financial commitments are settled.",
        ),
      ],
    },
  },
  {
    id: "post-2",
    title: "Building an Inspection-Ready Workplace: HR & Labor Compliance in Ghana",
    slug: "building-an-inspection-ready-workplace-hr-compliance-ghana",
    excerpt:
      "Essential workplace policies, employment contracts, and statutory compliance required under Ghana's Labor Act.",
    category: "Human Resources",
    author: "Raphael Cameron Etse",
    cover_image: "/images/practice-hr.jpg",
    published: true,
    published_at: "2026-09-20T10:30:00.000Z",
    created_at: now,
    updated_at: now,
    content: {
      type: "doc",
      content: [
        heading(2, "Compliance Protects Your Business and Staff"),
        paragraph(
          "For growing businesses, SMEs, and NGOs in Ghana, having up-to-date staff files and Labor Act compliant policies isn't just about passing labor inspections—it protects organizational stability and staff trust.",
        ),
        heading(2, "Critical Compliance Pillars"),
        bulletList([
          "Standardized employment contracts outlining terms, probationary clauses, and leave entitlements",
          "Documented health, safety, and workplace conduct handbooks",
          "Timely statutory remittances for SSNIT, Tier 2 pensions, and PAYE tax filings",
          "Clear disciplinary and grievance procedures aligned with labor standards",
        ]),
        paragraph(
          "Regular HR audits identify risk areas early, ensuring organizations maintain an inspection-ready standard year-round.",
        ),
      ],
    },
  },
  {
    id: "post-3",
    title: "Strategic Project Supervision: How Proper Planning Cuts Building Costs",
    slug: "strategic-project-supervision-how-planning-cuts-building-costs",
    excerpt:
      "Why active on-site project coordination and transparent material budgeting prevent costly delays in construction projects.",
    category: "Construction & Project Management",
    author: "Eric Semanu-Uzziah Dornyo",
    cover_image: "/images/practice-construction.jpg",
    published: true,
    published_at: "2026-09-28T08:15:00.000Z",
    created_at: now,
    updated_at: now,
    content: {
      type: "doc",
      content: [
        heading(2, "The Cost of Poor Supervision"),
        paragraph(
          "In construction and property development, budget overruns rarely stem from materials pricing alone; they arise from lack of coordination, incorrect material specs, and rework on site.",
        ),
        heading(2, "Phased Milestones and Milestone Reporting"),
        paragraph(
          "Independent supervision ensures contractors adhere to architectural and structural drawings, material testing requirements, and milestone delivery dates.",
        ),
        bulletList([
          "Daily logs and stage validation before concrete pours",
          "Transparent procurement verification against market pricing",
          "Clear photographic milestone reporting for diasporan and local developers",
        ]),
      ],
    },
  },
];

