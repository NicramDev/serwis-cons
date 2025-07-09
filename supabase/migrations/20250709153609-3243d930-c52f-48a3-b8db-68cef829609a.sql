-- Drop existing policies and create new ones with different names
DROP POLICY IF EXISTS "Allow all on vehicles" ON vehicles;
DROP POLICY IF EXISTS "Allow all operations on vehicles" ON vehicles;

-- Create proper RLS policies for vehicles table
CREATE POLICY "vehicles_all_access"
ON vehicles FOR ALL
USING (true)
WITH CHECK (true);

-- Fix storage policies
DROP POLICY IF EXISTS "All operations on vehicle-files bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow all operations on vehicle-files bucket" ON storage.objects;

-- Create proper storage policies for vehicle-files bucket
CREATE POLICY "vehicle_files_all_access"
ON storage.objects FOR ALL
USING (bucket_id = 'vehicle-files')
WITH CHECK (bucket_id = 'vehicle-files');

-- Ensure bucket exists and is public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vehicle-files', 'vehicle-files', true)
ON CONFLICT (id) DO UPDATE SET public = true;