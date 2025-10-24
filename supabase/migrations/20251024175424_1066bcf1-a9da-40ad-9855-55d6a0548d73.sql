-- 1) Create new table vehicle_equipment identical to equipment
create table if not exists public.vehicle_equipment (
  id uuid primary key default gen_random_uuid(),
  vehicleid uuid,
  lastservice date,
  nextservice date,
  serviceexpirydate date,
  servicereminderdays integer,
  images jsonb,
  attachments jsonb,
  year integer,
  purchaseprice double precision,
  purchasedate date,
  name text not null,
  brand text,
  type text,
  model text,
  serialnumber text,
  notes text,
  status text default 'ok',
  thumbnail text
);

-- Index for faster lookups per vehicle
create index if not exists idx_vehicle_equipment_vehicleid on public.vehicle_equipment (vehicleid);

-- Enable RLS
alter table public.vehicle_equipment enable row level security;

-- Drop policy if exists and create new
drop policy if exists "Allow all on vehicle_equipment" on public.vehicle_equipment;
create policy "Allow all on vehicle_equipment" on public.vehicle_equipment for all using (true) with check (true);

-- Realtime support
alter table public.vehicle_equipment replica identity full;