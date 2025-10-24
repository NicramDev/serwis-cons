-- Add quantity and service interval hours columns to vehicle_equipment table
ALTER TABLE public.vehicle_equipment 
ADD COLUMN IF NOT EXISTS quantity integer,
ADD COLUMN IF NOT EXISTS serviceintervalhours integer;