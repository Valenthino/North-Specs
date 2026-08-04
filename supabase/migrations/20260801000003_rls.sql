-- ============================================================================
-- North Specs Labs — Row Level Security
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
