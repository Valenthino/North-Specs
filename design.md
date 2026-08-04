# North Specs Labs Design System

- Version: 1.0
- System name: Forest Assay
- Primary use: North Specs Labs websites, ecommerce, research resources, product graphics, email, social media and printed collateral

## 1. Brand idea

North Specs Labs should feel like a premium scientific supply company: precise, restrained, trustworthy and contemporary. The visual language comes from three sources:

1. Forest green and white product labels.
2. Warm laboratory paper and printed assay records.
3. Clean, evidence-led ecommerce with generous space and simple navigation.

The result is premium through clarity, materials and discipline. It should never look like consumer wellness, a supplement brand, a medical clinic or speculative biotech.

### Brand characteristics

- Scientific, never clinical.
- Premium, never flashy.
- Calm, never sterile.
- Documentary, never promotional hype.
- Modern, never trendy for its own sake.
- Responsible, with Research Use Only information always easy to find.

## 2. Core design principles

### Evidence before persuasion

Show specifications, batch documentation, research context and clear limitations. Claims should be specific and verifiable. Avoid exaggerated superlatives.

### One controlled accent

Forest green is the only general-purpose accent. Amber is a technical marker reserved for measurements, calculator readings and exceptional caution states.

### Premium through restraint

Use whitespace, typographic hierarchy, high-quality product imagery, hairline borders and careful alignment. Avoid ornamental gradients, glow effects and excessive shadows.

### Laboratory utility

Interfaces should be easy to scan and operate. A researcher should quickly find the product, concentration, batch document, calculator, account or order information they need.

### Responsible research context

Research Use Only language belongs throughout the experience, but should be integrated into the hierarchy instead of appearing as alarming visual clutter.

## 3. Design tokens

### Colour palette

| Token | Hex | Role |
| --- | --- | --- |
| Warm bone | `#F7F4ED` | Default page background and laboratory-paper ground |
| White | `#FFFFFF` | Cards, forms, product panels and content surfaces |
| Graphite green | `#141F18` | Primary text and shared dark panels |
| Secondary ink | `#4B5A4C` | Supporting text, metadata and descriptions |
| Forest green | `#1B573A` | Primary actions, links and active states |
| Deep forest | `#123D28` | Accent text, hover states and high-contrast green |
| Soft assay green | `#D8EEE1` | Verified states, badges and subtle fills |
| Measurement amber | `#B3936C` | Readings, gauges and limited technical emphasis |
| Protocol border | `#DDD6C7` | Hairlines, fields, dividers and card borders |

### Colour rules

- Use graphite green instead of pure black.
- Use warm bone as the main background, with white surfaces placed on top.
- Green should signal actions, selection, verification or brand identity.
- Do not fill an entire ordinary section with bright green.
- Dark panels use graphite green and may include the faint shared molecular lattice texture.
- Amber must remain rare. It is not a second brand accent.
- Error red and warning ochre may appear only for semantic system feedback.
- Maintain WCAG AA contrast for text and interactive controls.

### CSS variables

```css
:root {
  --ns-bg: #f7f4ed;
  --ns-surface: #ffffff;
  --ns-ink: #141f18;
  --ns-ink-secondary: #4b5a4c;
  --ns-accent: #1b573a;
  --ns-accent-dark: #123d28;
  --ns-accent-soft: #d8eee1;
  --ns-marker: #b3936c;
  --ns-border: #ddd6c7;

  --ns-radius-control: 6px;
  --ns-radius-card: 12px;
  --ns-radius-pill: 9999px;

  --ns-space-1: 4px;
  --ns-space-2: 8px;
  --ns-space-3: 12px;
  --ns-space-4: 16px;
  --ns-space-5: 24px;
  --ns-space-6: 32px;
  --ns-space-7: 48px;
  --ns-space-8: 64px;
  --ns-space-9: 80px;

  --ns-shadow-card: 0 18px 50px rgba(20, 31, 24, 0.08);
}
```

## 4. Typography

### Font families

| Use | Typeface | Weights |
| --- | --- | --- |
| Display and headings | Cabinet Grotesk | 500, 700 |
| Body and interface | Public Sans | 400, 500, 600, 700 |
| Technical metadata | JetBrains Mono | 500 |

Self-host fonts whenever possible. Use a system sans-serif fallback if the branded fonts are unavailable.

### Type behaviour

- Headings are compact, confident and slightly tight.
- Body copy is open and highly readable.
- Keep long-form text near 60 to 70 characters per line.
- JetBrains Mono is only for real measurements and identifiers, including batch numbers, SKUs, molecular data, purity and syringe units.
- Do not use monospaced type as decoration.
- Use sentence case for headings and buttons.
- Avoid long uppercase phrases. Short RUO labels and technical badges may use uppercase.

### Suggested scale

```css
--ns-text-xs: 0.75rem;
--ns-text-sm: 0.875rem;
--ns-text-base: 1rem;
--ns-text-lg: 1.125rem;
--ns-text-xl: 1.375rem;
--ns-text-2xl: clamp(1.75rem, 3vw, 2.5rem);
--ns-text-hero: clamp(2.75rem, 6vw, 5.75rem);
```

Headings normally use a `1.02` to `1.15` line height. Body copy normally uses `1.55` to `1.7`.

## 5. Spacing and layout

- Use an 8px spacing rhythm, with 4px allowed for fine alignment.
- Standard section padding is 64px on mobile and 80px on desktop.
- The main content shell is approximately 1240px wide with 16px mobile gutters and 24px to 32px desktop gutters.
- Use asymmetry for hero and editorial compositions.
- Use ordered grids for products, documentation and account data.
- Every multi-column composition must include a deliberate mobile stack.
- Cards should not be the default container for every section. Prefer whitespace and hairline dividers for editorial content.

### Responsive reference

| Range | Behaviour |
| --- | --- |
| Under 600px | Single-column content, compact product cards, full-width actions where useful |
| 600px to 900px | Two-column product or article grids, stacked hero and checkout |
| Above 900px | Full navigation, asymmetric hero, multi-column catalogue, two-column checkout |

## 6. Shape, border and elevation

The system has only three radius rules:

- `6px` for buttons, fields and interactive controls.
- `12px` for cards, panels and order summaries.
- Full pill for badges, filters and compact status chips.

Use one-pixel protocol borders. Elevation should be soft and green-tinted. Never use hard black shadows, neon glow or glassmorphism.

## 7. Image direction

### Product imagery

- Vials are clean, upright and sharply legible.
- Use soft laboratory light, white or pale green-neutral backgrounds and realistic glass reflections.
- Product labels must remain accurate. Do not invent compounds, strengths, certifications or text.
- Leave sufficient negative space around the vial.
- Keep the product itself as the visual priority.

### Lifestyle and editorial imagery

- Use credible laboratory environments, glassware, chromatography, assay records and researchers performing non-clinical work.
- Prefer pale neutral environments with restrained green details.
- Avoid needles entering skin, bodies, fitness imagery, before-and-after imagery, tablets, supplement scoops and medical treatment scenes.
- Avoid generic blue sci-fi laboratories, excessive holograms or glowing DNA imagery.

### Texture and graphics

- A subtle molecular or hexagonal lattice may sit on dark panels at very low opacity.
- Fine assay lines, measurement ticks and structured tables are welcome when they convey information.
- Decorative graphics must never imitate a certificate or test result.

## 8. Iconography

- Use simple outlined icons with rounded joins and approximately 1.75px to 2px strokes.
- Icons should describe practical functions: search, account, cart, document, flask, batch, shipping and calculator.
- Default icon colour is current text colour.
- Avoid mixed icon families, filled emoji-style symbols and ornate illustrations.

## 9. Components

### Buttons

Primary buttons use forest green, white text, a 6px radius and no heavy shadow. Secondary buttons use a transparent background with a forest border. Tertiary actions are text links with a simple directional arrow.

Buttons use direct labels such as `Browse compounds`, `View batch record`, `Track order` and `Contact research support`.

### Cards

Product, calculator and order cards use a white surface, protocol border, 12px radius and soft shadow. Keep internal spacing consistent and align technical metadata.

Editorial content should usually use open layouts rather than nested cards.

### Badges

Verified, available and documented states use a soft green pill with deep forest text. Measurement badges may use amber. RUO badges should be calm, clear and persistent.

### Forms

- White fields with a protocol border and 6px radius.
- Minimum 44px interactive height.
- Forest focus ring with a visible two-pixel outline.
- Labels remain visible above fields.
- Use concise help text and specific error messages.
- Do not rely on placeholder text as the only label.

### Navigation

Desktop navigation is clear, compact and category-led. Mobile navigation uses a full-width drawer with large tap targets and nested sections. Keep search, account and cart easy to reach.

### Product cards

Each product card includes:

1. Accurate vial image.
2. Research Use Only status.
3. Product name and strength or selectable variation.
4. Documentation availability.
5. Price.
6. One clear purchase action.

### Checkout and account

- Use a calm two-column desktop checkout with a sticky order summary.
- Stack billing and order review on mobile without horizontal overflow.
- Capture laboratory or organization and research role.
- Show the RUO attestation near the final purchase action.
- Account screens should prioritize orders, status, tracking, documentation and support.

### Reconstitution calculator

- Present inputs and results as a technical reference, not a dosing tool.
- Use JetBrains Mono for computed values.
- The syringe graphic responds directly to entered values.
- Amber marks the current measurement.
- Show clear over-capacity and invalid-input warnings.
- Always state that the calculation is not a protocol or recommendation.

## 10. Motion

Motion is quiet and functional.

- Use 150ms to 250ms transitions.
- Prefer opacity, colour and small positional changes.
- Product-card hover may lift by 2px to 4px.
- Respect `prefers-reduced-motion`.
- Avoid bouncing buttons, looping animations, parallax and dramatic page transitions.

## 11. Voice and copy

The voice is clinical in discipline but plain in language.

### Use

- `Research compounds, sourced with scientific discipline.`
- `Batch documentation available by lot.`
- `For qualified laboratory research only.`
- `Contact research support.`

### Avoid

- Treatment, dosage or outcome guidance.
- Consumer wellness language.
- Miracle, breakthrough, anti-ageing or transformation claims.
- Fear-based urgency and false scarcity.
- Claims that documentation proves suitability for human or veterinary use.

Product and research copy must distinguish published research context from the intended use of the material being sold.

## 12. Research Use Only standard

Use this core statement where a full notice is required:

> All products offered by North Specs Labs are intended strictly for laboratory research purposes. These materials are not for human consumption and are not intended for diagnostic, therapeutic, medical or veterinary use.

Short form:

> For laboratory Research Use Only. Not for human or veterinary use.

RUO information should appear in the utility bar, product experience, checkout, footer and relevant research content.

## 13. Accessibility and quality checklist

Before approving any design:

- Confirm text contrast meets WCAG AA.
- Confirm keyboard focus is clearly visible.
- Confirm touch targets are at least 44px when practical.
- Confirm the layout works at 390px, 768px, 1024px and 1440px.
- Confirm no horizontal overflow appears on mobile.
- Confirm product label text and strength remain accurate.
- Confirm RUO language is visible and unambiguous.
- Confirm amber is limited to technical readings or caution.
- Confirm mono type contains actual data.
- Confirm there are no pure black grounds or shadows.
- Confirm the asset does not imply human, veterinary, therapeutic or diagnostic use.

## 14. Do and do not

### Do

- Use forest green as the controlled accent.
- Create hierarchy with space, type and alignment.
- Show accurate product photography and real technical information.
- Keep interfaces calm, clear and easy to scan.
- Use the same lattice texture across dark brand panels.
- Keep legal, privacy and RUO information easy to find.

### Do not

- Introduce purple, bright blue, neon green or generic biotech gradients.
- Use pure black text, backgrounds or shadows.
- Turn amber into a general brand colour.
- Put every section inside a rounded card.
- Use excessive pills, glass effects, floating blobs or decorative dashboards.
- Use consumer health, fitness or transformation imagery.
- Invent scientific results, certifications, purity values or product claims.

## 15. Reusable small-design prompt

Copy the prompt in [`small-design-prompt.md`](./small-design-prompt.md) and replace the bracketed fields. It is suitable for banners, social posts, email headers, announcement tiles, product highlights, document covers and small landing-page sections.

## 16. Source of truth

- Cross-platform brand guide: this file.
- WordPress implementation: `wordpress-theme/north-specs-labs/`.
- Machine-readable Novamira design seed: `wordpress-content/DESIGN.md`.
- Reusable creation prompt: `small-design-prompt.md`.

When an implementation conflicts with this guide, prefer the accessible and more restrained option, then update this file so the system remains consistent.
