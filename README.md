# North Specs Peptides

Research-grade peptide e-commerce for Canadian labs and researchers — built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **Supabase (Postgres)**.

Every product is presented strictly as **Research Use Only — not for human or veterinary use**, with compliance messaging throughout the storefront.

> **Runs out of the box.** The storefront works immediately using a built-in demo catalogue (no database required). Once you connect Supabase and apply the migrations, live data takes over automatically.

---

## Features

**Storefront**
- Twist-Bioscience-inspired design: clean scientific aesthetic, desktop mega-menu, slide-in mobile menu, slide-out cart.
- Home, shop/catalogue with category filtering + sorting + search, and rich product pages with full scientific specs (CAS, molecular formula, weight, sequence, purity) and Certificate of Analysis tables.
- Generated on-brand product artwork (molecular-lattice visuals) so the catalogue looks polished without uploading images.
- Cart (localStorage) + guest checkout with Canadian provinces, PO numbers, GST/HST estimate, and free-shipping threshold.
- Educational **Learn** section, **Quality & Testing**, **About**, **Contact**, **COA** index, and legal pages.
- First-visit **Research Use Only** acknowledgement gate and RUO notices throughout.

**Accounts** (requires Supabase)
- Researcher registration capturing lab/institution and account type, sign-in, profile editing.
- Account dashboard + order history.

**Admin backend** (requires Supabase, role-gated)
- Dashboard with product/order/revenue stats.
- Product CRUD with per-size **variants** (SKU, price, stock) management.
- Order management with status workflow and internal notes.
- Category management.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router, React 19, Server Actions) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 3.4 + custom design tokens |
| Database / Auth / Storage | Supabase (Postgres, RLS, Auth, Storage) |
| Icons | lucide-react |
| Validation | zod |

---

## Quick start

```bash
npm install
npm run dev
```

Open **http://localhost:3000**. The storefront runs on the built-in demo catalogue — browse, filter, add to cart, and go through checkout (in demo mode, orders are simulated, not saved).

> Accounts and the admin backend need Supabase (below).

---

## Connect Supabase

The Supabase project ref for this build is **`swcxswuecljpegbrkbqt`**.

### 1. Environment variables

Copy `.env.example` to `.env.local` and fill in your keys (Supabase dashboard → **Project Settings → API**):

```bash
cp .env.example .env.local
```

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://swcxswuecljpegbrkbqt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-or-anon-key
NEXT_PUBLIC_SUPABASE_PROJECT_ID=swcxswuecljpegbrkbqt
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # server only
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Apply the database schema

Migrations live in [`supabase/migrations`](./supabase/migrations) and the demo data in [`supabase/seed.sql`](./supabase/seed.sql).

**Option A — Supabase CLI (recommended)**

```bash
supabase link --project-ref swcxswuecljpegbrkbqt
supabase db push          # applies migrations
# then load the demo catalogue:
supabase db execute --file supabase/seed.sql
```

**Option B — Dashboard SQL editor (one paste)**

Open **Supabase Dashboard → SQL Editor**, paste the entire contents of
[`supabase/setup.sql`](./supabase/setup.sql), and run it once. That single file
bundles the schema, functions, RLS, storage buckets, and demo catalogue.

*(Or run each source file individually in order: `migrations/20260801000001_init_schema.sql`,
`…000002_functions.sql`, `…000003_rls.sql`, `…000004_storage.sql`, then `seed.sql`.)*

### 3. Regenerate types (optional)

The hand-authored `src/lib/supabase/database.types.ts` matches the schema. To regenerate from your live project:

```bash
supabase gen types typescript --project-id swcxswuecljpegbrkbqt --schema public > src/lib/supabase/database.types.ts
```

### 4. Create an admin user

1. Register at `/auth/register` (or create a user in the Supabase dashboard).
2. In **Table editor → `profiles`**, set that user's `role` to `admin`.
3. Visit `/admin`.

---

## Database schema

Core tables (all under RLS):

- `categories`, `products`, `product_variants`, `coa_documents` — public read (active rows), staff write.
- `profiles` (extends `auth.users`), `addresses` — users own their rows; a trigger auto-creates a profile on sign-up.
- `orders`, `order_items` — users see their own; staff manage all. Order numbers auto-generate as `NS-YYYY-######`.
- `learn_articles`, `contact_messages`.

Helper functions `is_staff()` / `is_admin()` back the RLS policies. Storage buckets: `product-images`, `category-images`, `coa-documents` (public read, staff write).

---

## Project structure

```
src/
├── app/                      # App Router routes
│   ├── (storefront)          # home, shop, categories, cart, checkout
│   ├── account/              # dashboard, orders, profile
│   ├── admin/                # role-gated backend + server actions
│   ├── auth/                 # login, register, callback + actions
│   ├── learn/  coa/  legal/  # content
│   └── contact/  about/  quality/
├── components/               # ui/, layout/, product/, cart/, admin/, compliance/, account/
├── config/                   # site + navigation config
└── lib/
    ├── catalog/              # built-in demo catalogue + domain types
    ├── data/                 # data-access layer (Supabase → demo fallback)
    └── supabase/             # clients, middleware, database.types.ts
supabase/
├── migrations/               # SQL schema, functions, RLS, storage
├── seed.sql                  # demo catalogue
└── config.toml
```

The **data-access layer** (`src/lib/data/*`) always tries Supabase first and falls back to the built-in catalogue, so the same components render whether or not the database is connected.

---

## Scripts

```bash
npm run dev         # dev server
npm run build       # production build
npm run start       # serve production build
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
```

---

## Roadmap (wired for later)

- **Payments** — Stripe env vars are stubbed in `.env.example`; the checkout records orders as `pending` / `unpaid`, ready for a payment step.
- **Transactional email** — Resend env vars are stubbed for order confirmations.
- **Buyer verification** — `profiles.verification_status` supports a research-buyer verification workflow.

---

## Compliance

All products are supplied strictly for **in-vitro laboratory research**. They are **not** drugs, foods, cosmetics or supplements and are **not for human or veterinary use**. Storefront copy, the checkout confirmation step, the first-visit gate, and the footer all reflect this. Review the copy and the pages in `/legal` with qualified counsel before going live.
