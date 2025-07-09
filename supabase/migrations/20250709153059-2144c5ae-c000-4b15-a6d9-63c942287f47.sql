-- Fix RLS policies for vehicles table to allow deletion
DROP POLICY IF EXISTS "Allow all on vehicles" ON vehicles;

-- Create proper RLS policies for vehicles table
CREATE POLICY "Allow all operations on vehicles"
ON vehicles FOR ALL
USING (true)
WITH CHECK (true);

-- Fix RLS policies for storage bucket
DROP POLICY IF EXISTS "All operations on vehicle-files bucket" ON storage.objects;

-- Create proper storage policies for vehicle-files bucket
CREATE POLICY "Allow all operations on vehicle-files bucket"
ON storage.objects FOR ALL
USING (bucket_id = 'vehicle-files')
WITH CHECK (bucket_id = 'vehicle-files');

-- Ensure bucket exists and is public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vehicle-files', 'vehicle-files', true)
ON CONFLICT (id) DO UPDATE SET public = true;