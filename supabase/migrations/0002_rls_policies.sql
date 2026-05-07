create or replace function current_role()
returns text
language sql
stable
security definer
set search_path = public
as $$ select coalesce(role, 'VIEWER') from public.profiles where id = auth.uid() $$;

create or replace function is_admin_manager()
returns boolean
language sql
stable
security definer
set search_path = public
as $$ select coalesce(public.current_role() in ('ADMIN','MANAGER'), false) $$;

create or replace function current_full_name()
returns text
language sql
stable
security definer
set search_path = public
as $$ select full_name from public.profiles where id = auth.uid() $$;

create or replace function can_read_shipment(target_shipment_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.shipments s
    where s.id = target_shipment_id
      and (
        public.current_role() in ('ADMIN','MANAGER','LOGISTICS','VIEWER')
        or (public.current_role() = 'SALES' and s.sales_person = public.current_full_name())
        or (public.current_role() = 'PURCHASE' and s.shipment_direction = 'IMPORT')
      )
  )
$$;

alter table profiles enable row level security;
alter table customers enable row level security;
alter table suppliers enable row level security;
alter table shipments enable row level security;
alter table containers enable row level security;
alter table shipment_milestones enable row level security;
alter table documents enable row level security;
alter table carrier_rules enable row level security;
alter table tracking_jobs enable row level security;
alter table tracking_events enable row level security;
alter table manual_reviews enable row level security;
alter table alerts enable row level security;
alter table settings enable row level security;

create policy profiles_read_own_or_admin on profiles for select to authenticated using (id = auth.uid() or public.is_admin_manager());
create policy profiles_admin_manager_all on profiles for all to authenticated using (public.is_admin_manager()) with check (public.is_admin_manager());

create policy customers_read_scoped on customers for select to authenticated using (public.current_role() in ('ADMIN','MANAGER','LOGISTICS','VIEWER','SALES','PURCHASE'));
create policy suppliers_read_scoped on suppliers for select to authenticated using (public.current_role() in ('ADMIN','MANAGER','LOGISTICS','VIEWER','PURCHASE'));
create policy carrier_rules_read_logistics on carrier_rules for select to authenticated using (public.current_role() in ('ADMIN','MANAGER','LOGISTICS'));
create policy settings_read_admin_manager on settings for select to authenticated using (public.current_role() in ('ADMIN','MANAGER'));

create policy shipments_read_scoped on shipments for select to authenticated using (
  public.current_role() in ('ADMIN','MANAGER','LOGISTICS','VIEWER')
  or (public.current_role() = 'SALES' and sales_person = public.current_full_name())
  or (public.current_role() = 'PURCHASE' and shipment_direction = 'IMPORT')
);
create policy shipments_admin_manager_all on shipments for all to authenticated using (public.is_admin_manager()) with check (public.is_admin_manager());
create policy shipments_sales_update_assigned on shipments for update to authenticated using (public.current_role() = 'SALES' and sales_person = public.current_full_name()) with check (public.current_role() = 'SALES');
create policy shipments_purchase_update_import on shipments for update to authenticated using (public.current_role() = 'PURCHASE' and shipment_direction = 'IMPORT') with check (public.current_role() = 'PURCHASE');
create policy shipments_logistics_update on shipments for update to authenticated using (public.current_role() = 'LOGISTICS') with check (public.current_role() = 'LOGISTICS');

create policy containers_read_scoped on containers for select to authenticated using (public.can_read_shipment(shipment_id));
create policy milestones_read_scoped on shipment_milestones for select to authenticated using (public.can_read_shipment(shipment_id));
create policy documents_read_scoped on documents for select to authenticated using (public.can_read_shipment(shipment_id));
create policy tracking_jobs_read_scoped on tracking_jobs for select to authenticated using (public.can_read_shipment(shipment_id));
create policy tracking_events_read_scoped on tracking_events for select to authenticated using (public.can_read_shipment(shipment_id));
create policy manual_reviews_read_scoped on manual_reviews for select to authenticated using (public.can_read_shipment(shipment_id));
create policy alerts_read_scoped on alerts for select to authenticated using (public.can_read_shipment(shipment_id));

create policy customers_admin_manager_all on customers for all to authenticated using (public.is_admin_manager()) with check (public.is_admin_manager());
create policy suppliers_admin_manager_all on suppliers for all to authenticated using (public.is_admin_manager()) with check (public.is_admin_manager());
create policy carrier_rules_admin_manager_all on carrier_rules for all to authenticated using (public.is_admin_manager()) with check (public.is_admin_manager());
create policy settings_admin_manager_all on settings for all to authenticated using (public.is_admin_manager()) with check (public.is_admin_manager());

create policy logistics_all_containers on containers for all to authenticated using (public.current_role() in ('ADMIN','MANAGER','LOGISTICS')) with check (public.current_role() in ('ADMIN','MANAGER','LOGISTICS'));
create policy logistics_all_milestones on shipment_milestones for all to authenticated using (public.current_role() in ('ADMIN','MANAGER','LOGISTICS')) with check (public.current_role() in ('ADMIN','MANAGER','LOGISTICS'));
create policy logistics_all_documents on documents for all to authenticated using (public.current_role() in ('ADMIN','MANAGER','LOGISTICS')) with check (public.current_role() in ('ADMIN','MANAGER','LOGISTICS'));
create policy logistics_all_tracking_jobs on tracking_jobs for all to authenticated using (public.current_role() in ('ADMIN','MANAGER','LOGISTICS')) with check (public.current_role() in ('ADMIN','MANAGER','LOGISTICS'));
create policy logistics_all_tracking_events on tracking_events for all to authenticated using (public.current_role() in ('ADMIN','MANAGER','LOGISTICS')) with check (public.current_role() in ('ADMIN','MANAGER','LOGISTICS'));
create policy logistics_all_manual_reviews on manual_reviews for all to authenticated using (public.current_role() in ('ADMIN','MANAGER','LOGISTICS')) with check (public.current_role() in ('ADMIN','MANAGER','LOGISTICS'));
create policy logistics_all_alerts on alerts for all to authenticated using (public.current_role() in ('ADMIN','MANAGER','LOGISTICS')) with check (public.current_role() in ('ADMIN','MANAGER','LOGISTICS'));
