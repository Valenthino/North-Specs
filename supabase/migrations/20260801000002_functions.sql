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
