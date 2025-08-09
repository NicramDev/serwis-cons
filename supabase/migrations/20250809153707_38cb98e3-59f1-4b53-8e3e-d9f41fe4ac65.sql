-- Add mdvrnumber column to vehicles table
ALTER TABLE public.vehicles
ADD COLUMN IF NOT EXISTS mdvrnumber text;