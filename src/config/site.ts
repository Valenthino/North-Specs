export const siteConfig = {
  name: "North Specs Labs",
  legalName: "North Specs Labs",
  shortName: "North Specs",
  tagline: "Research-grade peptides for laboratories and qualified researchers.",
  description:
    "North Specs Labs supplies high-purity, third-party-tested research peptides to laboratories and qualified researchers across Canada. Every product is Research Use Only — not for human or veterinary use.",
  url: "https://northspecs.ca",
  domain: "northspecs.ca",
  locale: "en-CA",
  country: "Canada",
  currency: "CAD",
  contact: {
    email: "research@northspecs.ca",
    supportEmail: "support@northspecs.ca",
    complianceEmail: "compliance@northspecs.ca",
    privacyEmail: "privacy@northspecs.ca",
    phone: "+1 (000) 000-0000",
    hours: "Monday–Friday, 9:00–17:00 ET",
  },
  compliance: {
    ruoShort: "Research Use Only",
    ruoLong: "For laboratory research use only. Not for human or veterinary use.",
    notForHuman: "Not for human consumption.",
    disclaimer:
      "All products supplied by North Specs Labs are intended strictly for in-vitro laboratory research and development. They are not drugs, foods, cosmetics or supplements, and are not intended to diagnose, treat, cure or prevent any disease. Not for human or veterinary use.",
    /** The buyer attestation shown at the research gate and at checkout. */
    attestation:
      "By purchasing from this website, I confirm that I am a qualified researcher, laboratory or research institution, and that I fully understand the research-use-only designation associated with these products.",
  },
  freeShippingThresholdCents: 20000,
  flatShippingCents: 1500,
  /** Signals repeated across the storefront — mirrors the header trust strip. */
  guarantees: [
    { title: "≥99% verified purity", text: "HPLC and mass-spec tested" },
    { title: "COA with every batch", text: "Independent third-party labs" },
    { title: "Cold-chain shipping", text: "Stability-protected packaging" },
    { title: "Research support", text: "Talk to our scientific team" },
  ],
} as const;

export const canadianProvinces = [
  { code: "AB", name: "Alberta" },
  { code: "BC", name: "British Columbia" },
  { code: "MB", name: "Manitoba" },
  { code: "NB", name: "New Brunswick" },
  { code: "NL", name: "Newfoundland and Labrador" },
  { code: "NS", name: "Nova Scotia" },
  { code: "NT", name: "Northwest Territories" },
  { code: "NU", name: "Nunavut" },
  { code: "ON", name: "Ontario" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "QC", name: "Quebec" },
  { code: "SK", name: "Saskatchewan" },
  { code: "YT", name: "Yukon" },
] as const;
