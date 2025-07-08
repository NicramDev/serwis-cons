-- Tworzenie bucket dla plików pojazdów, urządzeń i serwisów
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vehicle-files', 'vehicle-files', true)
ON CONFLICT (id) DO NOTHING;

-- Polityki dla publicznego dostępu do odczytu plików
CREATE POLICY "Public read access for vehicle files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'vehicle-files');

-- Polityka pozwalająca wszystkim na upload plików
CREATE POLICY "Public upload access for vehicle files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'vehicle-files');

-- Polityka pozwalająca wszystkim na aktualizację plików
CREATE POLICY "Public update access for vehicle files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'vehicle-files')
WITH CHECK (bucket_id = 'vehicle-files');

-- Polityka pozwalająca wszystkim na usuwanie plików
CREATE POLICY "Public delete access for vehicle files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'vehicle-files');