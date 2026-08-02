export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readingMinutes: number;
  author: string;
  publishedAt: string;
  content: string;
}

export const demoArticles: Article[] = [
  {
    id: "reconstituting-lyophilized-peptides",
    title: "Reconstituting Lyophilized Peptides: A Lab Primer",
    slug: "reconstituting-lyophilized-peptides",
    excerpt:
      "A step-by-step laboratory reference for reconstituting lyophilized research peptides with bacteriostatic water.",
    category: "Handling",
    readingMinutes: 6,
    author: "North Specs Scientific Team",
    publishedAt: "2026-07-15",
    content: `## Reconstitution basics

Lyophilized (freeze-dried) peptides are reconstituted with an appropriate sterile diluent — typically bacteriostatic or sterile water — for research handling.

> **Research use only.** The information below is provided for laboratory reference and is not medical guidance.

### Suggested workflow

1. Allow the vial to reach room temperature.
2. Calculate the required diluent volume for your target working concentration.
3. Add diluent slowly down the vial wall; do not inject directly onto the powder.
4. Swirl gently — never shake — until fully dissolved.
5. Label and refrigerate; record the reconstitution date.

### Storage after reconstitution

Reconstituted peptides are generally kept refrigerated (2–8°C) and protected from light. Consult your own SOPs and the product specification.`,
  },
  {
    id: "reading-a-certificate-of-analysis",
    title: "Reading a Certificate of Analysis (COA)",
    slug: "reading-a-certificate-of-analysis",
    excerpt: "How to interpret purity, identity and test-method data on a peptide COA.",
    category: "Compliance",
    readingMinutes: 5,
    author: "North Specs Scientific Team",
    publishedAt: "2026-07-08",
    content: `## What a COA tells you

A Certificate of Analysis documents the identity and purity of a specific batch.

- **Purity (HPLC):** the percentage of the target peptide, commonly reported as ≥98% or ≥99%.
- **Identity (MS):** mass-spectrometry confirmation of molecular weight.
- **Batch number:** ties the certificate to a specific production lot.
- **Test date:** when the analysis was performed.

Every North Specs product page links to the batch COA where available.`,
  },
  {
    id: "cold-chain-handling-storage",
    title: "Cold-Chain Handling & Storage of Research Peptides",
    slug: "cold-chain-handling-storage",
    excerpt:
      "Best-practice storage, freeze-thaw and cold-chain guidance for research peptides.",
    category: "Handling",
    readingMinutes: 7,
    author: "North Specs Scientific Team",
    publishedAt: "2026-06-30",
    content: `## Keeping peptides stable

Most lyophilized peptides are stored at **-20°C** long term and are stable for extended periods when kept dry and protected from light.

### Freeze-thaw

Repeated freeze-thaw cycles can degrade peptides. Aliquot reconstituted material to minimise cycles.

### Cold chain

North Specs ships with appropriate protection. On arrival, inspect and transfer to -20°C promptly.`,
  },
  {
    id: "research-use-only-compliance-canada",
    title: "Research Use Only: Compliance for Canadian Labs",
    slug: "research-use-only-compliance-canada",
    excerpt:
      'What "Research Use Only" means and the compliance expectations for Canadian research buyers.',
    category: "Compliance",
    readingMinutes: 4,
    author: "North Specs Scientific Team",
    publishedAt: "2026-06-20",
    content: `## Research Use Only (RUO)

All North Specs products are supplied strictly for **laboratory and in-vitro research**. They are **not** drugs, supplements, cosmetics or food, and are **not for human or veterinary use**.

### Buyer expectations

- Purchases are for legitimate research entities and qualified researchers.
- Products must be handled under appropriate laboratory conditions.
- Products may not be resold or relabelled for human use.

By ordering you confirm you understand and accept these terms.`,
  },
];
