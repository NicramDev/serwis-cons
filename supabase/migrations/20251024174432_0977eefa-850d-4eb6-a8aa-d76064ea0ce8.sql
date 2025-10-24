-- Add service interval hours column to devices table
ALTER TABLE public.devices 
ADD COLUMN serviceintervalhours integer;