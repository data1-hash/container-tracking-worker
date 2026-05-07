insert into storage.buckets (id, name, public)
values ('shipment-documents', 'shipment-documents', false)
on conflict (id) do nothing;

create policy shipment_documents_read_restricted
on storage.objects
for select
to authenticated
using (bucket_id = 'shipment-documents' and public.current_role() in ('ADMIN','MANAGER','LOGISTICS'));

create policy shipment_documents_write_restricted
on storage.objects
for insert
to authenticated
with check (bucket_id = 'shipment-documents' and public.current_role() in ('ADMIN','MANAGER','LOGISTICS'));
