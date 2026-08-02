export const siteConfig = {
  name: "North Specs Peptides",
  shortName: "North Specs",
  tagline: "Research-grade peptides for Canadian labs and researchers.",
  description:
    "North Specs Peptides supplies high-purity, third-party-tested research peptides to Canadian laboratories and researchers. Every product is Research Use Only — not for human or veterinary use.",
  url: "https://northspecs.ca",
  locale: "en-CA",
  country: "Canada",
  currency: "CAD",
  contact: {
    email: "research@northspecs.ca",
    supportEmail: "support@northspecs.ca",
    phone: "+1 (000) 000-0000",
  },
  compliance: {
    ruoShort: "Research Use Only",
    ruoLong: "For laboratory research use only. Not for human or veterinary use.",
    notForHuman: "Not for human consumption.",
    disclaimer:
      "All products supplied by North Specs Peptides are intended strictly for in-vitro laboratory research and development. They are not drugs, foods, cosmetics or supplements, and are not intended to diagnose, treat, cure or prevent any disease. Not for human or veterinary use.",
  },
  freeShippingThresholdCents: 20000,
  flatShippingCents: 1500,
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
