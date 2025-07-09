-- Create equipment table
CREATE TABLE public.equipment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicleid UUID REFERENCES public.vehicles(id),
  name TEXT NOT NULL,
  brand TEXT,
  type TEXT,
  model TEXT,
  serialnumber TEXT,
  year INTEGER,
  purchaseprice DOUBLE PRECISION,
  purchasedate DATE,
  lastservice DATE,
  nextservice DATE,
  serviceexpirydate DATE,
  servicereminderdays INTEGER,
  notes TEXT,
  status TEXT DEFAULT 'ok',
  images JSONB,
  thumbnail TEXT,
  attachments JSONB
);

-- Enable Row Level Security
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (similar to devices table)
CREATE POLICY "Allow all on equipment" 
ON public.equipment 
FOR ALL 
USING (true) 
WITH CHECK (true);