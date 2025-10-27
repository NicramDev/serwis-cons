-- Add sim_number and phone_number columns to vehicles table
ALTER TABLE public.vehicles 
ADD COLUMN sim_number text,
ADD COLUMN phone_number text;