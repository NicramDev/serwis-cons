-- Drop ALL existing policies from all tables
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT schemaname, tablename, policyname 
              FROM pg_policies 
              WHERE schemaname = 'public' 
              AND tablename IN ('vehicles', 'devices', 'equipment', 'service_records', 'vehicle_equipment'))
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

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

-- Create secure RLS policies for vehicles
CREATE POLICY "Users can view their own vehicles" 
ON public.vehicles FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own vehicles" 
ON public.vehicles FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vehicles" 
ON public.vehicles FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vehicles" 
ON public.vehicles FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Create secure RLS policies for devices
CREATE POLICY "Users can view their own devices" 
ON public.devices FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own devices" 
ON public.devices FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own devices" 
ON public.devices FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own devices" 
ON public.devices FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Create secure RLS policies for equipment
CREATE POLICY "Users can view their own equipment" 
ON public.equipment FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own equipment" 
ON public.equipment FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own equipment" 
ON public.equipment FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own equipment" 
ON public.equipment FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Create secure RLS policies for service_records
CREATE POLICY "Users can view their own service records" 
ON public.service_records FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own service records" 
ON public.service_records FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own service records" 
ON public.service_records FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own service records" 
ON public.service_records FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Create secure RLS policies for vehicle_equipment
CREATE POLICY "Users can view their own vehicle equipment" 
ON public.vehicle_equipment FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own vehicle equipment" 
ON public.vehicle_equipment FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vehicle equipment" 
ON public.vehicle_equipment FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vehicle equipment" 
ON public.vehicle_equipment FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);