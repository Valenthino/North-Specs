# North Specs Labs — WordPress site content

Content authored for the live WordPress site at **https://northspecs.ca**.

> **This folder is the durable source for live WordPress content.** The research
> articles and core legal material have been published to the site. The source
> remains here for version control, review and future updates.

---

## Publication status

The custom `north-specs-labs` WordPress theme is live. The 16 research articles,
researcher FAQ, calculator experience and extended legal framework have been
published. All 19 WooCommerce products use the supplied North Specs vial
imagery. Divi remains installed as a rollback option.

---

## Site facts worth having on hand

- WordPress 7.0.2, PHP 8.3.31
- Active theme: **North Specs Labs 1.0.3**, custom coded
- Rollback theme: **Divi 5.9.0**
- Plugins: Novamira 1.11.1, WooCommerce 10.9.4, WP Mail SMTP 4.9.0
- **19 products** published across 6 categories: Metabolic Research (5),
  GH Secretagogues (4), Tissue Repair & Recovery (3), Longevity & Cellular
  Health (3), Neuro & Cognitive (2), Bioregulation & Signalling (2)
- **16 published research articles** with a dedicated Research Library
- Custom templates cover the homepage, shop, articles, FAQ, quality, account,
  checkout and reconstitution calculator
- Primary navigation contains desktop and mobile submenus
- Front page is set to page 83 (Home)
- An active design system named *"North Specs — Synapse Signal"* is saved on the
  site. `DESIGN.md` here is intended to **replace** it (approved by the owner).

---

## What is in this folder

### `DESIGN.md`
The design direction, in Novamira's DESIGN.md format, ready for
`novamira/save-design` with `activate: true`.

**"North Specs: Forest Assay"** — deep forest green `#1B573A` taken from the
vial labels, warm bone `#F7F4ED` ground from the reconstitution calculator
mockup, graphite-green ink `#141F18`, and amber `#B3936C` restricted to
measurement readouts so it never becomes a second accent. Cabinet Grotesk
display, Public Sans body, JetBrains Mono for real technical metadata only.
Dials: variance 0.5, density 0.4, motion 0.25.

### `legal/` — 8 pages, ~7,500 words
`terms.md` (Terms of Use and Conditions of Sale, with warranty disclaimer,
liability cap and indemnity), `privacy.md` (PIPEDA and GDPR, with a lawful-basis
table and retention schedule), `research-use-only.md`, `shipping.md`,
`returns.md`, `cookies.md`, `disclaimer.md`, `acceptable-use.md`.

The owner's Research Use Only wording is carried **verbatim** in
`research-use-only.md`, `terms.md` and `disclaimer.md`.

### `faq.md` — ~50 questions, ~2,200 words
Eight sections with anchors matching the planned navigation: `#compliance`,
`#ordering`, `#payments`, `#shipping`, `#quality`, `#handling`, `#catalogue`,
`#privacy`.

### `articles/` — 16 long-form pieces, ~16,000 words
Each file carries YAML front matter (`title`, `slug`, `excerpt`, `category`,
`topic`, `reading_minutes`) for mapping to WordPress posts and categories. The
`topic` value matches the planned blog filters (`metabolic`, `repair`,
`longevity`, `neuro`, `methodology`, `canada`, `us`, `europe`).

| # | Article | Topic |
| --- | --- | --- |
| 01 | What research peptides are actually studied for | methodology |
| 02 | Incretin research: GLP-1, GIP, multi-receptor agonists | metabolic |
| 03 | BPC-157: what the preclinical literature actually shows | repair |
| 04 | TB-500 and thymosin beta-4 | repair |
| 05 | Research landscape: Canada | canada |
| 06 | Research landscape: United States | us |
| 07 | Research landscape: Europe | europe |
| 08 | Mitochondrial-derived peptides: MOTS-c, humanin | longevity |
| 09 | Epithalon and the bioregulator tradition | longevity |
| 10 | GHK-Cu copper peptide research | repair |
| 11 | GH secretagogues: GHRH analogues vs ghrelin mimetics | methodology |
| 12 | Semax and Selank | neuro |
| 13 | Melanocortin peptides and receptor selectivity | methodology |
| 14 | Thymosin alpha-1 and immune modulation | methodology |
| 15 | Assay reproducibility, purity and counter-ions | methodology |
| 16 | Solid-phase synthesis, purification and cost | methodology |

---

## Editorial rules these were written under

Keep these if the content is edited or extended.

- **No em-dashes anywhere.** Novamira's `novamira/check-design` pre-flight flags
  them as an AI tell and fails the check. Every file in this folder is clean;
  verify with `grep -rl '—' .` returning nothing.
- **No therapeutic claims.** Every article carries an RUO notice at the top and a
  closing statement. Compound effects are described as what published research
  has examined, never as what the product does.
- **Honest about weak evidence.** Where a literature is thin or
  replication-poor, the articles say so plainly. The BPC-157 piece states that
  the literature is concentrated in a small number of affiliated groups with no
  identified receptor; the epithalon piece states that a well-controlled
  replication attempt may find nothing. This is deliberate and protective: a
  supplier publishing careful reviews is defensible in a way that one publishing
  hype is not.
- **One correction the site should get right:** TB-500 is a *fragment* of
  thymosin beta-4 (the LKKTET actin-binding region), not a synonym. Results from
  one should not be assumed to transfer to the other.

---

## Implementation references

- Live theme source: `../wordpress-theme/north-specs-labs/`
- Cross-platform visual guide: `../design.md`
- Reusable small-design prompt: `../small-design-prompt.md`
- Machine-readable Novamira design: `DESIGN.md`

Run the design preflight and the theme's PHP and JavaScript validation whenever
the visual system or templates are changed.
