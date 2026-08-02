-- ============================================================================
-- North Specs Peptides — ONE-SHOT SETUP
-- Paste this entire file into the Supabase Dashboard → SQL Editor and run it
-- ONCE on a fresh project (ref: swcxswuecljpegbrkbqt).
-- It creates the schema, functions, RLS policies, storage buckets, and loads
-- the demo catalogue. The seed is re-runnable; policies are not (run once).
-- Generated from supabase/migrations/* + supabase/seed.sql
-- ============================================================================


-- ─────────────────────────────────────────────────────────────────────────
-- SOURCE: supabase/migrations/20260801000001_init_schema.sql
-- ─────────────────────────────────────────────────────────────────────────

-- ============================================================================
-- North Specs Peptides — Initial schema
-- Research-grade peptides for Canadian labs & researchers (Research Use Only).
-- ============================================================================

create extension if not exists "pgcrypto";     -- gen_random_uuid()
create extension if not exists "citext";        -- case-insensitive email

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('customer', 'staff', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.account_type as enum ('academic', 'commercial', 'government', 'individual');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.verification_status as enum ('unverified', 'pending', 'verified', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.order_status as enum (
    'pending', 'awaiting_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
  );
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- Shared helper: keep updated_at fresh
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- Categories
-- ----------------------------------------------------------------------------
create table if not exists public.categories (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  slug              text not null unique,
  description       text,
  short_description text,
  image_url         text,
  icon              text,
  display_order     integer not null default 0,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists categories_slug_idx on public.categories (slug);
create index if not exists categories_active_idx on public.categories (is_active);

create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Products
-- ----------------------------------------------------------------------------
create table if not exists public.products (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  slug               text not null unique,
  subtitle           text,
  description        text,
  category_id        uuid references public.categories (id) on delete set null,

  -- Scientific specification (research metadata)
  cas_number         text,
  molecular_formula  text,
  molecular_weight   numeric(12, 4),
  sequence           text,
  synonyms           text[] not null default '{}',
  purity             text,               -- e.g. '≥99%'
  appearance         text,               -- e.g. 'Lyophilized white powder'
  form               text,               -- e.g. 'Lyophilized powder'
  source             text default 'Synthetic',
  solubility         text,
  storage            text,
  reconstitution     text,
  research_areas     text[] not null default '{}',

  -- Merchandising
  image_url          text,
  gallery_urls       text[] not null default '{}',
  coa_url            text,
  is_active          boolean not null default true,
  is_featured        boolean not null default false,
  research_use_only  boolean not null default true,

  -- SEO
  meta_title         text,
  meta_description   text,

  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index if not exists products_slug_idx on public.products (slug);
create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_active_idx on public.products (is_active);
create index if not exists products_featured_idx on public.products (is_featured);

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Product variants (sizes / prices, in CAD cents)
-- ----------------------------------------------------------------------------
create table if not exists public.product_variants (
  id                     uuid primary key default gen_random_uuid(),
  product_id             uuid not null references public.products (id) on delete cascade,
  name                   text not null,             -- e.g. '10 mg'
  sku                    text not null unique,
  size_mg                numeric(12, 4),
  price_cents            integer not null check (price_cents >= 0),
  compare_at_price_cents integer check (compare_at_price_cents >= 0),
  stock_quantity         integer not null default 0,
  allow_backorder        boolean not null default false,
  is_active              boolean not null default true,
  display_order          integer not null default 0,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);
create index if not exists product_variants_product_idx on public.product_variants (product_id);
create index if not exists product_variants_sku_idx on public.product_variants (sku);

create trigger product_variants_set_updated_at
  before update on public.product_variants
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Certificates of Analysis (COA)
-- ----------------------------------------------------------------------------
create table if not exists public.coa_documents (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references public.products (id) on delete cascade,
  variant_id    uuid references public.product_variants (id) on delete set null,
  batch_number  text not null,
  purity        text,
  test_method   text,
  test_date     date,
  file_url      text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);
create index if not exists coa_product_idx on public.coa_documents (product_id);

-- ----------------------------------------------------------------------------
-- Profiles (extends auth.users)
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id                  uuid primary key references auth.users (id) on delete cascade,
  email               citext,
  full_name           text,
  role                public.user_role not null default 'customer',
  account_type        public.account_type,
  organization_name   text,               -- lab / institution / company
  department          text,
  job_title           text,
  phone               text,
  verification_status public.verification_status not null default 'unverified',
  accepted_terms_at   timestamptz,
  marketing_opt_in    boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index if not exists profiles_role_idx on public.profiles (role);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Addresses (Canada-focused)
-- ----------------------------------------------------------------------------
create table if not exists public.addresses (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles (id) on delete cascade,
  label          text,
  recipient_name text not null,
  organization   text,
  line1          text not null,
  line2          text,
  city           text not null,
  province       text not null,           -- ON, QC, BC, AB, ...
  postal_code    text not null,
  country        text not null default 'CA',
  phone          text,
  is_default     boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists addresses_user_idx on public.addresses (user_id);

create trigger addresses_set_updated_at
  before update on public.addresses
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Orders
-- ----------------------------------------------------------------------------
create table if not exists public.orders (
  id                 uuid primary key default gen_random_uuid(),
  order_number       text not null unique,
  user_id            uuid references public.profiles (id) on delete set null,
  email              citext not null,
  status             public.order_status not null default 'pending',

  subtotal_cents     integer not null default 0,
  shipping_cents     integer not null default 0,
  tax_cents          integer not null default 0,
  discount_cents     integer not null default 0,
  total_cents        integer not null default 0,
  currency           text not null default 'CAD',

  shipping_address   jsonb,
  billing_address    jsonb,
  po_number          text,                -- purchase order (institutional buyers)
  customer_notes     text,
  internal_notes     text,

  payment_status     text not null default 'unpaid',
  payment_provider   text,
  payment_intent_id  text,

  placed_at          timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index if not exists orders_user_idx on public.orders (user_id);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_number_idx on public.orders (order_number);

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Order items (line snapshots)
-- ----------------------------------------------------------------------------
create table if not exists public.order_items (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null references public.orders (id) on delete cascade,
  product_id       uuid references public.products (id) on delete set null,
  variant_id       uuid references public.product_variants (id) on delete set null,
  product_name     text not null,
  variant_name     text,
  sku              text,
  unit_price_cents integer not null,
  quantity         integer not null check (quantity > 0),
  total_cents      integer not null,
  created_at       timestamptz not null default now()
);
create index if not exists order_items_order_idx on public.order_items (order_id);

-- ----------------------------------------------------------------------------
-- Learn / educational articles
-- ----------------------------------------------------------------------------
create table if not exists public.learn_articles (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  slug             text not null unique,
  excerpt          text,
  content          text,
  category         text,                  -- 'Handling', 'Reconstitution', 'Compliance', ...
  reading_minutes  integer default 5,
  cover_image_url  text,
  author           text default 'North Specs Scientific Team',
  is_published     boolean not null default true,
  published_at     timestamptz default now(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists learn_slug_idx on public.learn_articles (slug);
create index if not exists learn_published_idx on public.learn_articles (is_published);

create trigger learn_articles_set_updated_at
  before update on public.learn_articles
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Newsletter / research access requests
-- ----------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id           uuid primary key default gen_random_uuid(),
  name         text,
  email        citext not null,
  organization text,
  subject      text,
  message      text not null,
  handled      boolean not null default false,
  created_at   timestamptz not null default now()
);


-- ─────────────────────────────────────────────────────────────────────────
-- SOURCE: supabase/migrations/20260801000002_functions.sql
-- ─────────────────────────────────────────────────────────────────────────

-- ============================================================================
-- North Specs Peptides — Functions & triggers
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Auto-create a profile row when a new auth user signs up.
-- Reads optional metadata passed at sign-up (full_name, organization, etc.).
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, organization_name, account_type, phone)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'organization_name', ''),
    (case
       when new.raw_user_meta_data ->> 'account_type' in ('academic','commercial','government','individual')
       then (new.raw_user_meta_data ->> 'account_type')::public.account_type
       else null
     end),
    nullif(new.raw_user_meta_data ->> 'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- Admin/staff check used across RLS policies.
-- SECURITY DEFINER so it can read profiles without recursive RLS.
-- ----------------------------------------------------------------------------
create or replace function public.is_staff()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('staff', 'admin')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ----------------------------------------------------------------------------
-- Human-readable order numbers: NS-YYYY-###### (sequential per year).
-- ----------------------------------------------------------------------------
create sequence if not exists public.order_number_seq;

create or replace function public.generate_order_number()
returns trigger
language plpgsql
as $$
begin
  if new.order_number is null or new.order_number = '' then
    new.order_number := 'NS-' || to_char(now(), 'YYYY') || '-' ||
      lpad(nextval('public.order_number_seq')::text, 6, '0');
  end if;
  return new;
end;
$$;

drop trigger if exists orders_set_number on public.orders;
create trigger orders_set_number
  before insert on public.orders
  for each row execute function public.generate_order_number();


-- ─────────────────────────────────────────────────────────────────────────
-- SOURCE: supabase/migrations/20260801000003_rls.sql
-- ─────────────────────────────────────────────────────────────────────────

-- ============================================================================
-- North Specs Peptides — Row Level Security
-- Public can browse the catalogue; users own their data; staff/admin manage all.
-- ============================================================================

alter table public.categories       enable row level security;
alter table public.products         enable row level security;
alter table public.product_variants enable row level security;
alter table public.coa_documents    enable row level security;
alter table public.profiles         enable row level security;
alter table public.addresses        enable row level security;
alter table public.orders           enable row level security;
alter table public.order_items      enable row level security;
alter table public.learn_articles   enable row level security;
alter table public.contact_messages enable row level security;

-- ---- Catalogue: public read (active), staff write --------------------------
create policy "Categories are viewable by everyone"
  on public.categories for select using (is_active or public.is_staff());
create policy "Staff manage categories"
  on public.categories for all using (public.is_staff()) with check (public.is_staff());

create policy "Products are viewable by everyone"
  on public.products for select using (is_active or public.is_staff());
create policy "Staff manage products"
  on public.products for all using (public.is_staff()) with check (public.is_staff());

create policy "Variants are viewable by everyone"
  on public.product_variants for select using (is_active or public.is_staff());
create policy "Staff manage variants"
  on public.product_variants for all using (public.is_staff()) with check (public.is_staff());

create policy "COA documents are viewable by everyone"
  on public.coa_documents for select using (is_active or public.is_staff());
create policy "Staff manage COA documents"
  on public.coa_documents for all using (public.is_staff()) with check (public.is_staff());

create policy "Published articles are viewable by everyone"
  on public.learn_articles for select using (is_published or public.is_staff());
create policy "Staff manage articles"
  on public.learn_articles for all using (public.is_staff()) with check (public.is_staff());

-- ---- Profiles --------------------------------------------------------------
create policy "Users can view their own profile"
  on public.profiles for select using (auth.uid() = id or public.is_staff());
create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);
create policy "Staff manage profiles"
  on public.profiles for all using (public.is_admin()) with check (public.is_admin());

-- ---- Addresses -------------------------------------------------------------
create policy "Users manage their own addresses"
  on public.addresses for all
  using (auth.uid() = user_id or public.is_staff())
  with check (auth.uid() = user_id);

-- ---- Orders ----------------------------------------------------------------
create policy "Users can view their own orders"
  on public.orders for select using (auth.uid() = user_id or public.is_staff());
create policy "Users can create their own orders"
  on public.orders for insert with check (auth.uid() = user_id or user_id is null);
create policy "Staff manage orders"
  on public.orders for all using (public.is_staff()) with check (public.is_staff());

create policy "Users can view their own order items"
  on public.order_items for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.user_id = auth.uid() or public.is_staff())
    )
  );
create policy "Users can insert their own order items"
  on public.order_items for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.user_id = auth.uid() or o.user_id is null)
    )
  );
create policy "Staff manage order items"
  on public.order_items for all using (public.is_staff()) with check (public.is_staff());

-- ---- Contact messages ------------------------------------------------------
create policy "Anyone can submit a contact message"
  on public.contact_messages for insert with check (true);
create policy "Staff can read contact messages"
  on public.contact_messages for select using (public.is_staff());
create policy "Staff manage contact messages"
  on public.contact_messages for all using (public.is_staff()) with check (public.is_staff());


-- ─────────────────────────────────────────────────────────────────────────
-- SOURCE: supabase/migrations/20260801000004_storage.sql
-- ─────────────────────────────────────────────────────────────────────────

-- ============================================================================
-- North Specs Peptides — Storage buckets
-- Product imagery and COA PDFs are publicly readable; only staff can write.
-- ============================================================================

insert into storage.buckets (id, name, public)
values
  ('product-images', 'product-images', true),
  ('category-images', 'category-images', true),
  ('coa-documents', 'coa-documents', true)
on conflict (id) do nothing;

-- Public read access to all three buckets.
create policy "Public read for catalogue assets"
  on storage.objects for select
  using (bucket_id in ('product-images', 'category-images', 'coa-documents'));

-- Only staff/admin may upload, update, or delete assets.
create policy "Staff upload catalogue assets"
  on storage.objects for insert
  with check (
    bucket_id in ('product-images', 'category-images', 'coa-documents')
    and public.is_staff()
  );

create policy "Staff update catalogue assets"
  on storage.objects for update
  using (
    bucket_id in ('product-images', 'category-images', 'coa-documents')
    and public.is_staff()
  );

create policy "Staff delete catalogue assets"
  on storage.objects for delete
  using (
    bucket_id in ('product-images', 'category-images', 'coa-documents')
    and public.is_staff()
  );


-- ─────────────────────────────────────────────────────────────────────────
-- SOURCE: supabase/seed.sql
-- ─────────────────────────────────────────────────────────────────────────

-- ============================================================================
-- North Specs Peptides — Seed data (Research Use Only catalogue)
-- Safe to re-run: uses ON CONFLICT (slug) DO NOTHING.
-- Prices are in CAD cents.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------
insert into public.categories (name, slug, short_description, description, icon, display_order) values
  ('Metabolic Research', 'metabolic-research',
   'Incretin and metabolic-signalling peptides for research.',
   'GLP-1, GIP and related incretin analogues studied for metabolic and endocrine signalling pathways. Supplied strictly for in-vitro and laboratory research.',
   'activity', 1),
  ('Growth Hormone Secretagogues', 'growth-hormone-secretagogues',
   'GHRH analogues and growth-hormone releasing peptides.',
   'Secretagogue peptides investigated for their action on the somatotropic axis. For laboratory research use only.',
   'trending-up', 2),
  ('Tissue Repair & Recovery', 'tissue-repair-recovery',
   'Peptides studied in tissue, connective and cellular repair models.',
   'Compounds frequently referenced in regenerative and cytoprotective research models. Research use only.',
   'heart-pulse', 3),
  ('Longevity & Cellular Health', 'longevity-cellular-health',
   'Bioregulators and mitochondrial-signalling peptides.',
   'Peptides investigated in cellular ageing, telomere and mitochondrial research. Not for human or veterinary use.',
   'infinity', 4),
  ('Neuro & Cognitive', 'neuro-cognitive',
   'Neuropeptides studied in cognition and neuroprotection.',
   'Nootropic and neuroprotective peptides used in behavioural and neurological research models.',
   'brain', 5),
  ('Bioregulation & Signalling', 'bioregulation-signalling',
   'Melanocortin, kisspeptin and signalling peptides.',
   'Signalling peptides studied across endocrine and receptor-pharmacology research. Research use only.',
   'atom', 6)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
insert into public.products
  (name, slug, subtitle, category_id, cas_number, molecular_formula, molecular_weight,
   sequence, purity, appearance, form, storage, reconstitution, research_areas,
   description, is_featured, is_active)
select v.name, v.slug, v.subtitle,
  (select id from public.categories c where c.slug = v.category_slug),
  v.cas_number, v.molecular_formula, v.molecular_weight, v.sequence, v.purity,
  v.appearance, v.form, v.storage, v.reconstitution, v.research_areas,
  v.description, v.is_featured, true
from (values
  ('Semaglutide', 'semaglutide', 'GLP-1 receptor agonist', 'metabolic-research',
   '910463-68-2', 'C187H291N45O59', 4113.58,
   'HAEGTFTSDVSSYLEGQAAKEFIAWLVRGRG (modified)', '≥99%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C, protect from light.',
   'Reconstitute with bacteriostatic or sterile water; keep refrigerated after reconstitution.',
   array['Metabolic signalling','Endocrinology','Incretin research'],
   'Semaglutide is a long-acting GLP-1 receptor agonist widely referenced in metabolic and incretin-signalling research. Supplied as a lyophilized powder for laboratory research applications only.', true),
  ('Tirzepatide', 'tirzepatide', 'Dual GIP/GLP-1 receptor agonist', 'metabolic-research',
   '2023788-19-2', 'C225H348N48O68', 4813.53,
   'YXEGTFTSDYSIXLDKIAQKAFVQWLIAGGPSSGAPPPS (modified)', '≥99%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C, protect from light.',
   'Reconstitute with bacteriostatic or sterile water; keep refrigerated after reconstitution.',
   array['Metabolic signalling','Dual incretin research','Endocrinology'],
   'Tirzepatide is a dual GIP and GLP-1 receptor agonist studied extensively in incretin-pathway research. For in-vitro / laboratory research use only.', true),
  ('Retatrutide', 'retatrutide', 'Triple GIP/GLP-1/glucagon agonist', 'metabolic-research',
   '2381089-83-2', 'C221H346N46O66', 4731.30,
   'Multi-agonist analogue', '≥99%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C, protect from light.',
   'Reconstitute with bacteriostatic or sterile water; keep refrigerated after reconstitution.',
   array['Triple-agonist research','Metabolic signalling'],
   'Retatrutide is a triple receptor agonist (GIP/GLP-1/glucagon) referenced in advanced metabolic-signalling studies. Research use only.', true),
  ('Tesamorelin', 'tesamorelin', 'GHRH analogue', 'metabolic-research',
   '218949-48-5', 'C221H366N72O67S', 5135.87,
   'YAEGTFTSDYSKYLDKMHTHTHTHTHTH', '≥98%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C.',
   'Reconstitute with bacteriostatic water; refrigerate after reconstitution.',
   array['Somatotropic axis','Lipid metabolism research'],
   'Tesamorelin is a stabilised GHRH analogue used in endocrine and metabolic research models. Research use only.', false),
  ('AOD-9604', 'aod-9604', 'hGH fragment 176-191', 'metabolic-research',
   '221231-10-3', 'C78H123N23O23S2', 1815.08,
   'YLRIVQCRSVEGSCGF', '≥98%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C.',
   'Reconstitute with bacteriostatic or sterile water.',
   array['Lipid metabolism research','hGH fragment studies'],
   'AOD-9604 is a modified fragment of human growth hormone (176-191) studied in lipid-metabolism research. Research use only.', false),
  ('MOTS-c', 'mots-c', 'Mitochondrial-derived peptide', 'longevity-cellular-health',
   '1627580-64-6', 'C101H152N28O23S2', 2174.55,
   'MRWQEMGYIFYPRKLR', '≥98%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C.',
   'Reconstitute with bacteriostatic or sterile water.',
   array['Mitochondrial research','Cellular metabolism'],
   'MOTS-c is a mitochondrial-derived peptide investigated in metabolic and cellular-stress research. Research use only.', true),
  ('CJC-1295 with DAC', 'cjc-1295-dac', 'Long-acting GHRH analogue', 'growth-hormone-secretagogues',
   '863288-34-0', 'C165H269N47O46', 3647.19,
   'Modified GRF (1-29) with DAC', '≥98%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C.',
   'Reconstitute with bacteriostatic water; refrigerate after reconstitution.',
   array['Somatotropic axis','GHRH research'],
   'CJC-1295 with DAC is a long-acting GHRH analogue used in somatotropic-axis research. Research use only.', false),
  ('Ipamorelin', 'ipamorelin', 'Selective GH secretagogue', 'growth-hormone-secretagogues',
   '170851-70-4', 'C38H49N9O5', 711.85,
   'Aib-His-D-2-Nal-D-Phe-Lys-NH2', '≥99%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C.',
   'Reconstitute with bacteriostatic or sterile water.',
   array['GH secretagogue research','Ghrelin-receptor studies'],
   'Ipamorelin is a selective growth-hormone secretagogue and ghrelin-receptor agonist referenced in endocrine research. Research use only.', true),
  ('Sermorelin', 'sermorelin', 'GHRH (1-29)', 'growth-hormone-secretagogues',
   '86168-78-7', 'C149H246N44O42S', 3357.93,
   'GRF (1-29)', '≥98%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C.',
   'Reconstitute with bacteriostatic water; refrigerate after reconstitution.',
   array['Somatotropic axis','GHRH research'],
   'Sermorelin is a GHRH (1-29) analogue widely used in somatotropic-axis research models. Research use only.', false),
  ('Hexarelin', 'hexarelin', 'GH-releasing hexapeptide', 'growth-hormone-secretagogues',
   '140703-51-1', 'C47H58N12O6', 887.02,
   'His-D-2-methyl-Trp-Ala-Trp-D-Phe-Lys-NH2', '≥98%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C.',
   'Reconstitute with bacteriostatic or sterile water.',
   array['GH secretagogue research'],
   'Hexarelin is a synthetic growth-hormone releasing hexapeptide used in secretagogue research. Research use only.', false),
  ('BPC-157', 'bpc-157', 'Body Protection Compound', 'tissue-repair-recovery',
   '137525-51-0', 'C62H98N16O22', 1419.53,
   'GEPPPGKPADDAGLV', '≥99%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C.',
   'Reconstitute with bacteriostatic or sterile water.',
   array['Cytoprotection research','Connective-tissue models','Gastrointestinal research'],
   'BPC-157 is a synthetic pentadecapeptide referenced extensively in cytoprotective and tissue-repair research models. Research use only.', true),
  ('TB-500', 'tb-500', 'Thymosin Beta-4 fragment', 'tissue-repair-recovery',
   '77591-33-4', 'C212H350N56O78S', 4963.44,
   'Ac-SDKP (active region of Thymosin β4)', '≥98%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C.',
   'Reconstitute with bacteriostatic or sterile water.',
   array['Actin-regulation research','Tissue-repair models'],
   'TB-500 corresponds to the active region of Thymosin Beta-4 and is studied in actin-regulation and tissue-repair research. Research use only.', true),
  ('GHK-Cu', 'ghk-cu', 'Copper tripeptide-1', 'tissue-repair-recovery',
   '89030-95-5', 'C14H24N6O4Cu', 403.94,
   'Gly-His-Lys : Cu(II)', '≥99%',
   'Blue lyophilized powder', 'Lyophilized powder', 'Store lyophilized at -20°C, protect from light.',
   'Reconstitute with sterile water.',
   array['Dermatological research','Copper-peptide studies'],
   'GHK-Cu is a copper-binding tripeptide widely referenced in skin, collagen and copper-peptide research. Research use only.', false),
  ('Epithalon', 'epithalon', 'Telomerase-research tetrapeptide', 'longevity-cellular-health',
   '307297-39-8', 'C14H22N4O9', 390.35,
   'Ala-Glu-Asp-Gly', '≥99%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C.',
   'Reconstitute with bacteriostatic or sterile water.',
   array['Telomere research','Pineal bioregulation'],
   'Epithalon (Epitalon) is a synthetic tetrapeptide studied in telomere and cellular-ageing research. Research use only.', true),
  ('Thymosin Alpha-1', 'thymosin-alpha-1', 'Immunomodulatory peptide', 'longevity-cellular-health',
   '62304-98-7', 'C129H215N33O55', 3108.30,
   'Ac-SDAAVDTSSEITTKDLKEKKEVVEEAEN', '≥98%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C.',
   'Reconstitute with bacteriostatic or sterile water.',
   array['Immunology research','Cellular signalling'],
   'Thymosin Alpha-1 is a 28-amino-acid peptide studied in immunomodulation research. Research use only.', false),
  ('Semax', 'semax', 'ACTH(4-10) analogue nootropic', 'neuro-cognitive',
   '80714-61-0', 'C37H51N9O10S', 813.92,
   'Met-Glu-His-Phe-Pro-Gly-Pro', '≥98%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C.',
   'Reconstitute with sterile or bacteriostatic water.',
   array['Neuroprotection research','Cognition models'],
   'Semax is a synthetic ACTH(4-10) analogue used in neuroprotection and cognition research. Research use only.', false),
  ('Selank', 'selank', 'Tuftsin-analogue anxiolytic peptide', 'neuro-cognitive',
   '129954-34-3', 'C33H57N11O9', 751.90,
   'Thr-Lys-Pro-Arg-Pro-Gly-Pro', '≥98%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C.',
   'Reconstitute with sterile or bacteriostatic water.',
   array['Anxiolytic research','Neuropeptide studies'],
   'Selank is a synthetic analogue of tuftsin studied in anxiolytic and neuropeptide research. Research use only.', false),
  ('PT-141', 'pt-141', 'Bremelanotide (melanocortin agonist)', 'bioregulation-signalling',
   '189691-06-3', 'C50H68N14O10', 1025.16,
   'Ac-Nle-cyclo(Asp-His-D-Phe-Arg-Trp-Lys)-OH', '≥98%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C.',
   'Reconstitute with sterile or bacteriostatic water.',
   array['Melanocortin-receptor research'],
   'PT-141 (Bremelanotide) is a melanocortin-receptor agonist referenced in receptor-pharmacology research. Research use only.', false),
  ('Melanotan II', 'melanotan-ii', 'Melanocortin agonist', 'bioregulation-signalling',
   '121062-08-6', 'C50H69N15O9', 1024.18,
   'Ac-Nle-cyclo(Asp-His-D-Phe-Arg-Trp-Lys)-NH2', '≥98%',
   'Lyophilized white powder', 'Lyophilized powder', 'Store lyophilized at -20°C, protect from light.',
   'Reconstitute with sterile or bacteriostatic water.',
   array['Melanocortin research','Pigmentation models'],
   'Melanotan II is a synthetic melanocortin-receptor agonist used in pigmentation and receptor research. Research use only.', false)
) as v(name, slug, subtitle, category_slug, cas_number, molecular_formula, molecular_weight,
       sequence, purity, appearance, form, storage, reconstitution, research_areas,
       description, is_featured)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Variants (sizes / prices in CAD cents)
-- ---------------------------------------------------------------------------
insert into public.product_variants (product_id, name, sku, size_mg, price_cents, stock_quantity, display_order)
select p.id, x.name, x.sku, x.size_mg, x.price_cents, x.stock, x.ord
from (values
  ('semaglutide','5 mg','NS-SEMA-05',5,8900,120,1),
  ('semaglutide','10 mg','NS-SEMA-10',10,15900,80,2),
  ('tirzepatide','10 mg','NS-TIRZ-10',10,16900,90,1),
  ('tirzepatide','15 mg','NS-TIRZ-15',15,22900,60,2),
  ('retatrutide','10 mg','NS-RETA-10',10,19900,50,1),
  ('tesamorelin','10 mg','NS-TESA-10',10,13900,40,1),
  ('aod-9604','5 mg','NS-AOD-05',5,6900,70,1),
  ('mots-c','10 mg','NS-MOTS-10',10,9900,55,1),
  ('cjc-1295-dac','5 mg','NS-CJCD-05',5,7900,65,1),
  ('ipamorelin','10 mg','NS-IPAM-10',10,7900,110,1),
  ('sermorelin','5 mg','NS-SERM-05',5,7400,60,1),
  ('hexarelin','5 mg','NS-HEXA-05',5,6900,45,1),
  ('bpc-157','5 mg','NS-BPC-05',5,5900,150,1),
  ('bpc-157','10 mg','NS-BPC-10',10,9900,120,2),
  ('tb-500','5 mg','NS-TB5-05',5,8900,90,1),
  ('tb-500','10 mg','NS-TB5-10',10,15900,60,2),
  ('ghk-cu','50 mg','NS-GHK-50',50,6400,80,1),
  ('epithalon','10 mg','NS-EPI-10',10,6900,75,1),
  ('epithalon','50 mg','NS-EPI-50',50,17900,30,2),
  ('thymosin-alpha-1','5 mg','NS-TA1-05',5,9400,40,1),
  ('semax','30 mg','NS-SMX-30',30,8900,50,1),
  ('selank','10 mg','NS-SLK-10',10,7400,50,1),
  ('pt-141','10 mg','NS-PT1-10',10,6900,65,1),
  ('melanotan-ii','10 mg','NS-MT2-10',10,6400,70,1)
) as x(product_slug, name, sku, size_mg, price_cents, stock, ord)
join public.products p on p.slug = x.product_slug
on conflict (sku) do nothing;

-- ---------------------------------------------------------------------------
-- Certificates of Analysis (sample batches)
-- ---------------------------------------------------------------------------
insert into public.coa_documents (product_id, batch_number, purity, test_method, test_date)
select p.id, x.batch, x.purity, x.method, x.test_date::date
from (values
  ('semaglutide','NS-SEMA-2607A','99.4%','HPLC / MS','2026-07-14'),
  ('tirzepatide','NS-TIRZ-2606B','99.1%','HPLC / MS','2026-06-28'),
  ('bpc-157','NS-BPC-2607C','99.7%','HPLC / MS','2026-07-02'),
  ('tb-500','NS-TB5-2606A','98.9%','HPLC / MS','2026-06-19'),
  ('ipamorelin','NS-IPAM-2607B','99.5%','HPLC / MS','2026-07-09')
) as x(product_slug, batch, purity, method, test_date)
join public.products p on p.slug = x.product_slug
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Learn / educational articles
-- ---------------------------------------------------------------------------
insert into public.learn_articles (title, slug, excerpt, category, reading_minutes, content) values
  ('Reconstituting Lyophilized Peptides: A Lab Primer', 'reconstituting-lyophilized-peptides',
   'A step-by-step laboratory reference for reconstituting lyophilized research peptides with bacteriostatic water.',
   'Handling', 6,
   E'## Reconstitution basics\n\nLyophilized (freeze-dried) peptides are reconstituted with an appropriate sterile diluent — typically bacteriostatic or sterile water — for research handling.\n\n> Research use only. The information below is provided for laboratory reference and is not medical guidance.\n\n### Suggested workflow\n1. Allow the vial to reach room temperature.\n2. Calculate the required diluent volume for your target working concentration.\n3. Add diluent slowly down the vial wall; do not inject directly onto the powder.\n4. Swirl gently — never shake — until fully dissolved.\n5. Label and refrigerate; record the reconstitution date.\n\n### Storage after reconstitution\nReconstituted peptides are generally kept refrigerated (2–8°C) and protected from light. Consult your own SOPs and the product specification.'),
  ('Reading a Certificate of Analysis (COA)', 'reading-a-certificate-of-analysis',
   'How to interpret purity, identity and test-method data on a peptide COA.',
   'Compliance', 5,
   E'## What a COA tells you\n\nA Certificate of Analysis documents the identity and purity of a specific batch.\n\n- **Purity (HPLC):** the percentage of the target peptide, commonly reported as ≥98% or ≥99%.\n- **Identity (MS):** mass-spectrometry confirmation of molecular weight.\n- **Batch number:** ties the certificate to a specific production lot.\n- **Test date:** when the analysis was performed.\n\nEvery North Specs product page links to the batch COA where available.'),
  ('Cold-Chain Handling & Storage of Research Peptides', 'cold-chain-handling-storage',
   'Best-practice storage, freeze-thaw and cold-chain guidance for research peptides.',
   'Handling', 7,
   E'## Keeping peptides stable\n\nMost lyophilized peptides are stored at **-20°C** long term and are stable for extended periods when kept dry and protected from light.\n\n### Freeze-thaw\nRepeated freeze-thaw cycles can degrade peptides. Aliquot reconstituted material to minimise cycles.\n\n### Cold chain\nNorth Specs ships with appropriate protection. On arrival, inspect and transfer to -20°C promptly.'),
  ('Research Use Only: Compliance for Canadian Labs', 'research-use-only-compliance-canada',
   'What "Research Use Only" means and the compliance expectations for Canadian research buyers.',
   'Compliance', 4,
   E'## Research Use Only (RUO)\n\nAll North Specs products are supplied strictly for **laboratory and in-vitro research**. They are **not** drugs, supplements, cosmetics or food, and are **not for human or veterinary use**.\n\n### Buyer expectations\n- Purchases are for legitimate research entities and qualified researchers.\n- Products must be handled under appropriate laboratory conditions.\n- Products may not be resold or relabelled for human use.\n\nBy ordering you confirm you understand and accept these terms.')
on conflict (slug) do nothing;

