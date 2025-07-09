-- First, let's check and fix the foreign key constraint for equipment table
-- We need to allow CASCADE deletion so when a vehicle is deleted, its equipment is also deleted

-- Drop the existing foreign key constraint if it exists
ALTER TABLE equipment DROP CONSTRAINT IF EXISTS equipment_vehicleid_fkey;

-- Add the foreign key constraint with CASCADE deletion
ALTER TABLE equipment 
ADD CONSTRAINT equipment_vehicleid_fkey 
FOREIGN KEY (vehicleid) 
REFERENCES vehicles(id) 
ON DELETE CASCADE;