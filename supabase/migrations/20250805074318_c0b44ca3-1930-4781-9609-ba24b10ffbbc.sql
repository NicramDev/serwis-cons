-- Add insurance policy number field to vehicles table
ALTER TABLE public.vehicles 
ADD COLUMN insurancepolicynumber text;