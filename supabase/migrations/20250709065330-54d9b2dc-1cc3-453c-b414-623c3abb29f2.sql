-- Remove tags column from equipment table if it exists
ALTER TABLE public.equipment DROP COLUMN IF EXISTS tags;