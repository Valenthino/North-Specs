-- ============================================================================
-- North Specs Labs — Storage buckets
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
