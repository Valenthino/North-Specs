export interface NavLink {
  label: string;
  href: string;
  description?: string;
  /** Optional flag rendered as a small pill next to the label. */
  tag?: "New" | "Popular" | "Tool";
}

export interface NavColumn {
  heading: string;
  links: NavLink[];
}

/** Primary navigation with mega-menu columns. */
export interface MegaNavItem {
  label: string;
  href: string;
  columns?: NavColumn[];
  featured?: {
    eyebrow: string;
    title: string;
    description: string;
    href: string;
    cta: string;
  };
}

/** Thin utility strip above the main header. */
export const utilityNav: NavLink[] = [
  { label: "Verify a batch", href: "/coa" },
  { label: "Reconstitution calculator", href: "/tools/reconstitution-calculator" },
  { label: "Researcher FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const mainNav: MegaNavItem[] = [
  {
    label: "Shop",
    href: "/shop",
    columns: [
      {
        heading: "Research Categories",
        links: [
          {
            label: "Metabolic Research",
            href: "/categories/metabolic-research",
            description: "GLP-1, GIP & incretin analogues",
          },
          {
            label: "GH Secretagogues",
            href: "/categories/growth-hormone-secretagogues",
            description: "GHRH analogues & releasing peptides",
          },
          {
            label: "Tissue Repair & Recovery",
            href: "/categories/tissue-repair-recovery",
            description: "Cytoprotection & regeneration models",
          },
          {
            label: "Longevity & Cellular Health",
            href: "/categories/longevity-cellular-health",
            description: "Bioregulators & mitochondrial peptides",
          },
          {
            label: "Neuro & Cognitive",
            href: "/categories/neuro-cognitive",
            description: "Neuroprotection & cognition models",
          },
          {
            label: "Bioregulation & Signalling",
            href: "/categories/bioregulation-signalling",
            description: "Melanocortin & signalling peptides",
          },
        ],
      },
      {
        heading: "Browse the catalogue",
        links: [
          { label: "All peptides", href: "/shop", description: "The complete research catalogue" },
          {
            label: "Featured compounds",
            href: "/shop?sort=featured",
            description: "Most cited in current research",
            tag: "Popular",
          },
          {
            label: "Newest additions",
            href: "/shop?sort=newest",
            description: "Recently added to the catalogue",
            tag: "New",
          },
          {
            label: "Blends & research kits",
            href: "/categories/tissue-repair-recovery",
            description: "Multi-peptide combination vials",
          },
          {
            label: "Certificates of Analysis",
            href: "/coa",
            description: "Third-party batch testing archive",
          },
          {
            label: "Bulk & institutional orders",
            href: "/contact?topic=bulk",
            description: "Volume pricing for labs",
          },
        ],
      },
    ],
    featured: {
      eyebrow: "Verified purity",
      title: "Every batch, independently tested",
      description:
        "HPLC and mass-spectrometry verified, with the batch COA published on every product page.",
      href: "/quality",
      cta: "See how we test",
    },
  },
  {
    label: "Research Tools",
    href: "/tools/reconstitution-calculator",
    columns: [
      {
        heading: "Calculators",
        links: [
          {
            label: "Reconstitution calculator",
            href: "/tools/reconstitution-calculator",
            description: "Exact syringe units for any target dose",
            tag: "Tool",
          },
          {
            label: "Concentration reference",
            href: "/tools/reconstitution-calculator#reference",
            description: "Common mg/ml preparation table",
          },
          {
            label: "Storage & stability guide",
            href: "/learn/cold-chain-handling-storage",
            description: "Cold-chain handling best practice",
          },
        ],
      },
      {
        heading: "Laboratory references",
        links: [
          {
            label: "Reconstitution protocol",
            href: "/learn/reconstituting-lyophilized-peptides",
            description: "Step-by-step laboratory primer",
          },
          {
            label: "How to read a COA",
            href: "/learn/reading-a-certificate-of-analysis",
            description: "Interpreting purity and identity data",
          },
          {
            label: "RUO compliance for labs",
            href: "/learn/research-use-only-compliance-canada",
            description: "Documentation and record keeping",
          },
        ],
      },
    ],
    featured: {
      eyebrow: "Free research tool",
      title: "Reconstitution calculator",
      description:
        "Enter your vial size, diluent volume and target dose — see the exact syringe fill, live.",
      href: "/tools/reconstitution-calculator",
      cta: "Open the calculator",
    },
  },
  {
    label: "Research Library",
    href: "/blog",
    columns: [
      {
        heading: "Peptide research journal",
        links: [
          { label: "All articles", href: "/blog", description: "Long-form research briefings" },
          {
            label: "Metabolic & incretin research",
            href: "/blog?topic=metabolic",
            description: "GLP-1, GIP and amylin literature",
          },
          {
            label: "Tissue repair & regeneration",
            href: "/blog?topic=repair",
            description: "Cytoprotection and healing models",
          },
          {
            label: "Longevity & cellular health",
            href: "/blog?topic=longevity",
            description: "Mitochondrial and senescence work",
          },
          {
            label: "Neuro & cognitive research",
            href: "/blog?topic=neuro",
            description: "Neuroprotection and plasticity",
          },
        ],
      },
      {
        heading: "Regulatory & regional",
        links: [
          {
            label: "Research landscape: Canada",
            href: "/blog?topic=canada",
            description: "Health Canada and academic programmes",
          },
          {
            label: "Research landscape: United States",
            href: "/blog?topic=us",
            description: "FDA pathways and NIH funding",
          },
          {
            label: "Research landscape: Europe",
            href: "/blog?topic=europe",
            description: "EMA and Horizon Europe programmes",
          },
          {
            label: "Handling & methodology",
            href: "/blog?topic=methodology",
            description: "Assay design and reproducibility",
          },
          {
            label: "Learn hub",
            href: "/learn",
            description: "Short practical laboratory guides",
          },
        ],
      },
    ],
    featured: {
      eyebrow: "Research library",
      title: "What peptides are actually being studied for",
      description:
        "In-depth briefings on the preclinical and clinical literature across North America and Europe.",
      href: "/blog",
      cta: "Read the library",
    },
  },
  {
    label: "Quality",
    href: "/quality",
    columns: [
      {
        heading: "How we verify",
        links: [
          {
            label: "Testing & quality programme",
            href: "/quality",
            description: "Our end-to-end verification process",
          },
          {
            label: "Certificate of Analysis archive",
            href: "/coa",
            description: "Look up any batch certificate",
          },
          {
            label: "Purity standards",
            href: "/quality#standards",
            description: "What ≥99% actually means",
          },
          {
            label: "Cold-chain logistics",
            href: "/quality#logistics",
            description: "Packaging and stability protection",
          },
        ],
      },
      {
        heading: "Compliance",
        links: [
          {
            label: "Research Use Only policy",
            href: "/legal/research-use-only",
            description: "The RUO designation explained",
          },
          {
            label: "Terms of Use",
            href: "/legal/terms",
            description: "Conditions of sale and site use",
          },
          {
            label: "Privacy policy",
            href: "/legal/privacy",
            description: "How we handle your data",
          },
          {
            label: "Shipping & returns",
            href: "/legal/shipping",
            description: "Dispatch, tracking and claims",
          },
        ],
      },
    ],
    featured: {
      eyebrow: "Research Use Only",
      title: "Sold to qualified researchers only",
      description:
        "Every order is confirmed as research use before dispatch. Not for human or veterinary use.",
      href: "/legal/research-use-only",
      cta: "Read the RUO policy",
    },
  },
  {
    label: "Support",
    href: "/faq",
    columns: [
      {
        heading: "Researcher help",
        links: [
          {
            label: "Researcher FAQ",
            href: "/faq",
            description: "Ordering, handling, compliance and more",
          },
          {
            label: "How to order",
            href: "/faq#ordering",
            description: "Accounts, quotes and purchase orders",
          },
          {
            label: "Payment methods",
            href: "/faq#payments",
            description: "Cards, e-transfer and institutional terms",
          },
          {
            label: "Shipping & tracking",
            href: "/faq#shipping",
            description: "Dispatch times and cold-chain transit",
          },
        ],
      },
      {
        heading: "Get in touch",
        links: [
          {
            label: "Contact our team",
            href: "/contact",
            description: "Scientific and account support",
          },
          {
            label: "Bulk & institutional enquiries",
            href: "/contact?topic=bulk",
            description: "Volume pricing and standing orders",
          },
          { label: "My account", href: "/account", description: "Orders, profile and documents" },
          {
            label: "Create a research account",
            href: "/auth/register",
            description: "For labs and qualified researchers",
          },
        ],
      },
    ],
    featured: {
      eyebrow: "Talk to a scientist",
      title: "Questions about a compound?",
      description:
        "Our scientific team answers specification, batch and handling questions directly.",
      href: "/contact",
      cta: "Contact the team",
    },
  },
  { label: "About", href: "/about" },
];

/**
 * Footer link groups. Each group renders its links in two columns so the
 * footer reads as a full sitemap rather than a short list.
 */
export const footerNav: NavColumn[] = [
  {
    heading: "Catalogue",
    links: [
      { label: "All peptides", href: "/shop" },
      { label: "Featured compounds", href: "/shop?sort=featured" },
      { label: "Newest additions", href: "/shop?sort=newest" },
      { label: "Metabolic research", href: "/categories/metabolic-research" },
      { label: "GH secretagogues", href: "/categories/growth-hormone-secretagogues" },
      { label: "Tissue repair & recovery", href: "/categories/tissue-repair-recovery" },
      { label: "Longevity & cellular health", href: "/categories/longevity-cellular-health" },
      { label: "Neuro & cognitive", href: "/categories/neuro-cognitive" },
      { label: "Bioregulation & signalling", href: "/categories/bioregulation-signalling" },
      { label: "Bulk & institutional orders", href: "/contact?topic=bulk" },
    ],
  },
  {
    heading: "Research resources",
    links: [
      { label: "Research library", href: "/blog" },
      { label: "Learn hub", href: "/learn" },
      { label: "Reconstitution calculator", href: "/tools/reconstitution-calculator" },
      { label: "Concentration reference", href: "/tools/reconstitution-calculator#reference" },
      { label: "Reconstitution protocol", href: "/learn/reconstituting-lyophilized-peptides" },
      { label: "How to read a COA", href: "/learn/reading-a-certificate-of-analysis" },
      { label: "Storage & handling", href: "/learn/cold-chain-handling-storage" },
      { label: "RUO compliance guide", href: "/learn/research-use-only-compliance-canada" },
      { label: "Certificates of Analysis", href: "/coa" },
      { label: "Researcher FAQ", href: "/faq" },
    ],
  },
  {
    heading: "Company & support",
    links: [
      { label: "About North Specs Labs", href: "/about" },
      { label: "Quality & testing", href: "/quality" },
      { label: "Purity standards", href: "/quality#standards" },
      { label: "Cold-chain logistics", href: "/quality#logistics" },
      { label: "Contact us", href: "/contact" },
      { label: "My account", href: "/account" },
      { label: "Order history", href: "/account/orders" },
      { label: "Create a research account", href: "/auth/register" },
      { label: "Sign in", href: "/auth/login" },
      { label: "View cart", href: "/cart" },
    ],
  },
  {
    heading: "Legal & compliance",
    links: [
      { label: "Research Use Only policy", href: "/legal/research-use-only" },
      { label: "Terms of Use", href: "/legal/terms" },
      { label: "Privacy policy", href: "/legal/privacy" },
      { label: "Shipping & delivery", href: "/legal/shipping" },
      { label: "Returns & refunds", href: "/legal/returns" },
      { label: "Cookie policy", href: "/legal/cookies" },
      { label: "Acceptable use", href: "/legal/acceptable-use" },
      { label: "Regulatory disclaimer", href: "/legal/disclaimer" },
      { label: "Ordering FAQ", href: "/faq#ordering" },
      { label: "Compliance FAQ", href: "/faq#compliance" },
    ],
  },
];
