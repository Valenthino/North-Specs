-- ============================================================================
-- North Specs Labs — Initial schema
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
