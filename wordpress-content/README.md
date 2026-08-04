# North Specs Labs — WordPress site content

Content authored for the live WordPress site at **https://northspecs.ca**.

> **This folder is content, not app code.** It has nothing to do with the Next.js
> app in the rest of this repository. It lives here only so the writing is stored
> durably and is easy to find again. Nothing here has been published to the live
> site yet.

---

## Why this is sitting in a folder instead of on the site

The work was blocked on tooling access, not on the writing.

The Novamira MCP connector gives full control of the WordPress install, and it
worked for one window early on (see "Already applied to the live site" below).
It then went unavailable and stayed that way. Two independent problems:

1. **The claude.ai connector is authorized but switched off for the chat.**
   `ListConnectors` reports `connected: true, enabledInChat: false` for
   *"Novamira - NORTH SPECS RESEARCH PEPTIDES LABS"*. That is a per-conversation
   toggle, so re-authorizing does not change it. It must be enabled in the
   conversation's own connector menu, not global settings.

2. **The site host is blocked by the sandbox network policy.** Any direct
   connection from the execution container fails before leaving:

   ```
   curl https://northspecs.ca/wp-json/  ->  CONNECT tunnel failed, response 403
   ```

   The `@automattic/mcp-wordpress-remote` npx transport fails the same way, with
   the reason stated explicitly:

   ```
   [API] Host not in allowlist: northspecs.ca.
         Add this host to your network egress settings to allow access.
   ```

   `claude mcp add ... --transport http` also registers fine but reports
   `Needs authentication`, and its OAuth step needs a browser, which a headless
   container does not have.

**Either fix unblocks it:** enable the connector for the conversation (fastest,
no environment change, and it bypasses container egress because it runs
server-side), or add `northspecs.ca` to the environment's network egress
allowlist.

---

## Already applied to the live site

Done during the one working window, both reversible:

| Change | Backup |
| --- | --- |
| Stock WordPress widgets moved out of active sidebars (Search, Recent Posts, Recent Comments from `sidebar-1`; Archives, Categories from `sidebar-2`) | option `northspecs_sidebars_widgets_backup` |
| `et_divi` → `divi_sidebar` and `divi_shop_page_sidebar` set to `et_full_width_page` | option `northspecs_et_divi_backup` |

---

## Site facts worth having on hand

- WordPress 7.0.2, PHP 8.3.31
- Theme: **Divi 5.9.0**, no child theme
- Plugins: Novamira 1.11.1, WooCommerce 10.9.4, WP Mail SMTP 4.9.0
- **19 products** published across 6 categories: Metabolic Research (5),
  GH Secretagogues (4), Tissue Repair & Recovery (3), Longevity & Cellular
  Health (3), Neuro & Cognitive (2), Bioregulation & Signalling (2)
- **0 blog posts**, and no page assigned as the posts page
- Pages already built with the Divi builder: Home (83), About (98),
  Quality (99), Contact (100), Learn (101). Legal pages (102 to 106) are plain.
- Primary menu is 7 flat items with no submenus
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

## Remaining build order

Once WordPress access is restored:

1. `novamira/save-design` with `DESIGN.md`, `activate: true`
2. Mega menu and mobile navigation (primary menu is currently 7 flat items)
3. Hero with the vial lineup
4. Reconstitution calculator with the live syringe
5. Publish the 16 posts, create categories, set a posts page, build the blog index
6. FAQ page
7. The 8 legal pages
8. Two-column footer
9. Checkout and shop polish

Load the `novamira-design` skill before any visual work, and run
`novamira/check-design` against the rendered front-end output before calling any
visual build done.

**Undecided:** the build surface question was answered as "Divi child theme with
coded templates" for chrome, but no child theme has been created yet.
