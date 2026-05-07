insert into storage.buckets (id, name, public) values ('shipment-documents', 'shipment-documents', false) on conflict (id) do nothing;
create policy shipment_documents_read on storage.objects for select to authenticated using (bucket_id = 'shipment-documents');
create policy shipment_documents_write on storage.objects for insert to authenticated with check (bucket_id = 'shipment-documents' and (public.is_admin_manager() or public.current_role() in ('LOGISTICS','MANAGER','ADMIN')));
