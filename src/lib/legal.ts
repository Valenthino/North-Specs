export interface LegalDoc {
  slug: string;
  title: string;
  updated: string;
  content: string;
}

export const legalDocs: Record<string, LegalDoc> = {
  "research-use-only": {
    slug: "research-use-only",
    title: "Research Use Only Policy",
    updated: "2026-07-01",
    content: `## Research Use Only

All products supplied by North Specs Peptides are intended **strictly for laboratory and in-vitro research use**. They are **not** drugs, foods, cosmetics, medical devices or dietary supplements, and are **not intended for human or veterinary use**.

## No diagnostic or therapeutic use

Our products are not intended to diagnose, treat, cure or prevent any disease or condition. They must not be administered to humans or animals.

## Buyer responsibilities

By purchasing from North Specs Peptides you represent and warrant that:

- You are a qualified researcher or an authorized representative of a research organization.
- You will use all products solely for legitimate laboratory research.
- You will handle, store and dispose of products in accordance with applicable laws and good laboratory practice.
- You will not resell, repackage or relabel products for human or veterinary use.

## Compliance

You are responsible for compliance with all applicable federal, provincial and local laws and regulations governing the purchase, possession, handling and use of research chemicals.`,
  },
  terms: {
    slug: "terms",
    title: "Terms of Sale",
    updated: "2026-07-01",
    content: `## Agreement

These Terms of Sale govern all orders placed with North Specs Peptides. By placing an order you accept these terms and our Research Use Only Policy.

## Eligibility

Orders are accepted from qualified researchers and research organizations in Canada. We may request verification of research use and reserve the right to decline or cancel any order.

## Pricing and payment

All prices are in Canadian dollars (CAD) and exclusive of applicable taxes unless stated. Prices are subject to change. Payment processing is provided by third-party providers.

## Shipping

We ship to Canadian research addresses. Title and risk of loss pass to the buyer on delivery to the carrier.

## Returns

Due to the nature of research materials, products are generally non-returnable once shipped, except where a product is defective or an order was fulfilled incorrectly. Contact us within 7 days of delivery.

## Limitation of liability

Products are provided "as is" for research use. To the maximum extent permitted by law, North Specs Peptides is not liable for any indirect or consequential damages arising from the use or misuse of products.`,
  },
  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    updated: "2026-07-01",
    content: `## Overview

This Privacy Policy explains how North Specs Peptides collects, uses and protects your personal information in accordance with Canadian privacy law (PIPEDA).

## Information we collect

- Account information: name, email, organization, phone.
- Order information: shipping address, purchase order details, order history.
- Technical information: usage data necessary to operate the site.

## How we use information

We use your information to process orders, provide customer support, maintain your account and comply with legal obligations.

## Sharing

We share information only with service providers necessary to operate our business (for example, payment and shipping providers) and where required by law.

## Your rights

You may request access to, correction of, or deletion of your personal information by contacting us.

## Security

We use industry-standard measures to protect your information. No method of transmission or storage is completely secure.`,
  },
  shipping: {
    slug: "shipping",
    title: "Shipping & Returns",
    updated: "2026-07-01",
    content: `## Shipping

We ship research peptides to Canadian research addresses. Orders are typically processed within 1–2 business days following order review.

## Cold chain

Where required, products are shipped with appropriate cold-chain protection to preserve stability. Inspect your shipment on arrival and store products according to the product specification.

## Rates

- Flat-rate shipping applies to orders below the free-shipping threshold.
- Free shipping is available on qualifying orders.

## Returns

Due to the nature of research materials, products are generally non-returnable once shipped. If a product arrives damaged or an order was fulfilled incorrectly, contact us within 7 days of delivery and we will make it right.`,
  },
};

export const legalSlugs = Object.keys(legalDocs);
