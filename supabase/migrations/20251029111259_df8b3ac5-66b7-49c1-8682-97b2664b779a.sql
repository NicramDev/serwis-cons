-- Fix storage bucket policies for vehicle-files
-- First, drop all existing permissive policies
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload vehicle files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read vehicle files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update vehicle files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete vehicle files" ON storage.objects;

-- Make the bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'vehicle-files';

-- Create proper user-scoped policies for vehicle-files bucket
-- Users can only access their own files organized by user_id
CREATE POLICY "Users can upload their own vehicle files" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'vehicle-files' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view their own vehicle files" 
ON storage.objects 
FOR SELECT 
TO authenticated
USING (
  bucket_id = 'vehicle-files' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own vehicle files" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (
  bucket_id = 'vehicle-files' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own vehicle files" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (
  bucket_id = 'vehicle-files' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);