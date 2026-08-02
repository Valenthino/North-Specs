export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavColumn {
  heading: string;
  links: NavLink[];
}

/** Primary navigation with mega-menu columns (Twist-inspired). */
export interface MegaNavItem {
  label: string;
  href: string;
  columns?: NavColumn[];
  featured?: {
    title: string;
    description: string;
    href: string;
  };
}

export const mainNav: MegaNavItem[] = [
  {
    label: "Peptides",
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
        heading: "Shop",
        links: [
          { label: "All Peptides", href: "/shop", description: "Browse the full catalogue" },
          { label: "Featured", href: "/shop?sort=featured", description: "Popular in research" },
          { label: "Blends & Stacks", href: "/shop?category=tissue-repair-recovery", description: "Combination research kits" },
          { label: "Certificates of Analysis", href: "/coa", description: "Third-party batch testing" },
        ],
      },
    ],
    featured: {
      title: "Every batch, third-party tested",
      description: "HPLC & mass-spec verified purity, with COA on every product page.",
      href: "/coa",
    },
  },
  {
    label: "Learn",
    href: "/learn",
    columns: [
      {
        heading: "Research Resources",
        links: [
          { label: "Reconstitution Guide", href: "/learn/reconstituting-lyophilized-peptides", description: "Step-by-step lab primer" },
          { label: "Reading a COA", href: "/learn/reading-a-certificate-of-analysis", description: "Interpreting purity data" },
          { label: "Storage & Handling", href: "/learn/cold-chain-handling-storage", description: "Cold-chain best practice" },
          { label: "RUO Compliance", href: "/learn/research-use-only-compliance-canada", description: "For Canadian labs" },
        ],
      },
      {
        heading: "Company",
        links: [
          { label: "About North Specs", href: "/about", description: "Our quality standards" },
          { label: "Quality & Testing", href: "/quality", description: "How we verify purity" },
          { label: "Contact", href: "/contact", description: "Talk to our team" },
        ],
      },
    ],
  },
  { label: "Quality", href: "/quality" },
  { label: "About", href: "/about" },
];

export const footerNav: NavColumn[] = [
  {
    heading: "Catalogue",
    links: [
      { label: "All Peptides", href: "/shop" },
      { label: "Metabolic Research", href: "/categories/metabolic-research" },
      { label: "GH Secretagogues", href: "/categories/growth-hormone-secretagogues" },
      { label: "Tissue Repair", href: "/categories/tissue-repair-recovery" },
      { label: "Longevity", href: "/categories/longevity-cellular-health" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { label: "Research Resources", href: "/learn" },
      { label: "Certificates of Analysis", href: "/coa" },
      { label: "Reconstitution Guide", href: "/learn/reconstituting-lyophilized-peptides" },
      { label: "Storage & Handling", href: "/learn/cold-chain-handling-storage" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Quality & Testing", href: "/quality" },
      { label: "Contact", href: "/contact" },
      { label: "My Account", href: "/account" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Research Use Only Policy", href: "/legal/research-use-only" },
      { label: "Terms of Sale", href: "/legal/terms" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Shipping & Returns", href: "/legal/shipping" },
    ],
  },
];
