-- Set default value for new rows
ALTER TABLE public.vehicles ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.devices ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.equipment ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.service_records ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.vehicle_equipment ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Update existing rows to assign them to the first user (if exists)
DO $$
DECLARE
  first_user_id uuid;
BEGIN
  SELECT id INTO first_user_id FROM auth.users LIMIT 1;
  
  IF first_user_id IS NOT NULL THEN
    UPDATE public.vehicles SET user_id = first_user_id WHERE user_id IS NULL;
    UPDATE public.devices SET user_id = first_user_id WHERE user_id IS NULL;
    UPDATE public.equipment SET user_id = first_user_id WHERE user_id IS NULL;
    UPDATE public.service_records SET user_id = first_user_id WHERE user_id IS NULL;
    UPDATE public.vehicle_equipment SET user_id = first_user_id WHERE user_id IS NULL;
  END IF;
END $$;

-- Make user_id NOT NULL only if there are no NULL values left
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.vehicles WHERE user_id IS NULL) THEN
    ALTER TABLE public.vehicles ALTER COLUMN user_id SET NOT NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.devices WHERE user_id IS NULL) THEN
    ALTER TABLE public.devices ALTER COLUMN user_id SET NOT NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.equipment WHERE user_id IS NULL) THEN
    ALTER TABLE public.equipment ALTER COLUMN user_id SET NOT NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.service_records WHERE user_id IS NULL) THEN
    ALTER TABLE public.service_records ALTER COLUMN user_id SET NOT NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.vehicle_equipment WHERE user_id IS NULL) THEN
    ALTER TABLE public.vehicle_equipment ALTER COLUMN user_id SET NOT NULL;
  END IF;
END $$;