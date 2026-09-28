export interface LegalLink {
  href: string;
  label: string;
  description: string;
}

/** The Legal item in the navigation, and the pages it opens. */
export const legalIndex: LegalLink = {
  href: "/legal",
  label: "Legal",
  description: "How we handle your information, cookies and the terms of using this site.",
};

export const legalLinks: LegalLink[] = [
  legalIndex,
  {
    href: "/cookie-policy",
    label: "Cookie policy",
    description: "What this site stores on your device, and what it does not.",
  },
  {
    href: "/privacy-policy",
    label: "Privacy policy",
    description: "What we collect when you send an enquiry, and what we do with it.",
  },
  {
    href: "/terms",
    label: "Terms and conditions",
    description: "The terms that apply when you use this site or work with us.",
  },
];

export const legalSubLinks = legalLinks.filter((link) => link.href !== legalIndex.href);
