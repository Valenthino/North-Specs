---
name: "North Specs: Forest Assay"
description: "A precise laboratory-supply look drawn from the North Specs vial labels: deep forest green on a warm bone ground, graphite-green ink, and an amber marker reserved for measurement and status."
colors:
  bg: "#F7F4ED"
  surface: "#FFFFFF"
  ink: "#141F18"
  ink-secondary: "#4B5A4C"
  accent: "#1B573A"
  accent-soft: "#D8EEE1"
  accent-ink: "#123D28"
  marker: "#B3936C"
  border: "#DDD6C7"
typography:
  heading:
    fontFamily: "Cabinet Grotesk, sans-serif"
    fontWeight: "700"
  body:
    fontFamily: "Public Sans, sans-serif"
    fontWeight: "400"
  mono:
    fontFamily: "JetBrains Mono, monospace"
    fontWeight: "500"
spacing:
  sm: "8px"
  md: "16px"
  lg: "32px"
  xl: "80px"
rounded:
  sm: "6px"
  md: "12px"
  pill: "9999px"
components:
  buttons: "Primary is solid forest green #1B573A with white text, 6px radius, no shadow. Secondary is a 1px #1B573A outline on transparent. Pill radius is reserved for filter chips and status badges."
  cards: "White surface, 1px #DDD6C7 border, 12px radius, soft green-tinted shadow. Used for products, order summaries and calculator panels only; elsewhere separate with hairlines and whitespace."
  inputs: "White, 1px #DDD6C7 border, 6px radius, forest-green focus ring. Preset choices render as bordered chips, not selects."
  badges: "Pill; #D8EEE1 ground with #123D28 text for verified, in-stock and COA states. Amber #B3936C ground reserved for measurement callouts."
dials:
  variance: 0.5
  density: 0.4
  motion: 0.25
---
# North Specs: Forest Assay

## Overview
North Specs Labs supplies research-grade peptides to laboratories and qualified
researchers. The site must read as laboratory supply, not consumer wellness:
exact, sober, and documentary. The direction is taken from the product itself:
the deep forest green and white of the vial labels, set on the warm bone ground
of laboratory paper and printed protocols. Every claim on the site is backed by
a batch certificate, so the visual language favours evidence over persuasion:
real numbers, real specifications, measured whitespace.

## Colors
The ground is a warm bone #F7F4ED with pure-white #FFFFFF surfaces for cards and
data panels. Ink is a deep graphite-green #141F18, softening to #4B5A4C for
secondary text; hairlines are #DDD6C7. The single accent is forest green #1B573A
(the label green), deepened to #123D28 for text and links, softened to #D8EEE1
for badge grounds. Amber #B3936C is a restricted marker, not a second accent: it
appears only on measurement callouts (the calculator fill marker, gauge labels)
where a reading must separate itself from the green interface. Green is rationed
to action and status; it never fills a section.

The bone ground is a declared brand choice, taken from the printed-protocol
aesthetic of the reconstitution tooling, and it is paired with forest green and
graphite rather than the usual brass-and-espresso treatment.

## Typography
Cabinet Grotesk carries display and headings, set tight (line-height 1.05–1.15)
and heavy. Public Sans handles body copy at a 60–70 character measure with
relaxed leading. JetBrains Mono is reserved for genuine technical metadata: CAS
numbers, molecular formulas, SKUs, purity percentages, batch identifiers, syringe
units, in small caps with light letter-spacing. Mono never decorates; if it is
set in mono it is a measurement.

## Layout
Deliberate spacing on an 8px base with an 80px section rhythm. Composition is
balanced but not rigid (variance 0.5): the hero uses an asymmetric split with the
vial lineup breaking its frame, while catalogue and documentation pages hold a
composed grid. Density 0.4 keeps whitespace generous without feeling sparse;
this is a catalogue, and researchers scan it. The product grid is a clean
responsive grid; checkout is two-column with a sticky order summary. Every
multi-column layout declares its mobile stack.

## Elevation & Depth
Flat by default. Cards carry one soft green-tinted shadow, never black, never a
glow. Most separation is hairline #DDD6C7 and whitespace. Deep forest panels
(#141F18 with a faint hexagonal lattice at low opacity) anchor the hero, the
quality band and the footer, giving the page three dark rests.

## Shapes
Two radii under a stated rule: 6px for buttons and inputs, 12px for cards and
panels. Full pill is reserved for badges and filter chips. No other radius
appears.

## Components
Buttons: solid forest primary, outlined secondary, 6px, no heavy shadow. Cards:
white, hairline border, 12px, soft tinted shadow, for products, order summaries and
calculator panels only. Inputs: white with a forest focus ring; preset values
render as bordered chips so a researcher can hit a common value in one tap.
Badges: soft-green pill for verified, in-stock and COA. Stylised vial artwork and
hexagonal molecular lattice stand in for photography where a real product shot is
unavailable.

## Do's and Don'ts
- Do keep forest green as the single accent, rationed to action and status.
- Do use JetBrains Mono only for real measurements and identifiers.
- Do hold the two-radius rule: 6px interactive, 12px containers, pill for badges.
- Do give every dark panel the same lattice texture so they read as one family.
- Don't let amber grow into a second accent; it marks readings only.
- Don't flood a section with green or introduce a third colour.
- Don't use pure black text, grounds or shadows.
- Don't add decorative status strips, version stamps or enumerated eyebrows.
- Don't mix registers; the voice stays clinical, plain and precise throughout.
