
-- Najpierw usuń bucket jeśli istnieje
DELETE FROM storage.buckets WHERE id = 'vehicle-files';

-- Usuń polityki jeśli istnieją
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public downloads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes" ON storage.objects;

-- Teraz stwórz wszystko od nowa
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'vehicle-files',
  'vehicle-files',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Polityki dla bucketu - pozwól wszystkim na upload i pobieranie
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'vehicle-files');

CREATE POLICY "Allow public downloads" ON storage.objects
FOR SELECT USING (bucket_id = 'vehicle-files');

CREATE POLICY "Allow public updates" ON storage.objects
FOR UPDATE USING (bucket_id = 'vehicle-files');

CREATE POLICY "Allow public deletes" ON storage.objects
FOR DELETE USING (bucket_id = 'vehicle-files');

-- Dodanie kolumn dla przechowywania ścieżek do plików w istniejących tabelach
-- Dla tabeli vehicles
DO $$
BEGIN
    -- Sprawdź czy kolumna images istnieje, jeśli nie - dodaj
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'vehicles' AND column_name = 'images') THEN
        ALTER TABLE vehicles ADD COLUMN images JSONB DEFAULT '[]'::jsonb;
    END IF;
    
    -- Sprawdź czy kolumna attachments istnieje, jeśli nie - dodaj
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'vehicles' AND column_name = 'attachments') THEN
        ALTER TABLE vehicles ADD COLUMN attachments JSONB DEFAULT '[]'::jsonb;
    END IF;
    
    -- Sprawdź czy kolumna thumbnail istnieje, jeśli nie - dodaj
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'vehicles' AND column_name = 'thumbnail') THEN
        ALTER TABLE vehicles ADD COLUMN thumbnail TEXT;
    END IF;
END
$$;

-- Dla tabeli devices
DO $$
BEGIN
    -- Sprawdź czy kolumna images istnieje, jeśli nie - dodaj
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'devices' AND column_name = 'images') THEN
        ALTER TABLE devices ADD COLUMN images JSONB DEFAULT '[]'::jsonb;
    END IF;
    
    -- Sprawdź czy kolumna attachments istnieje, jeśli nie - dodaj
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'devices' AND column_name = 'attachments') THEN
        ALTER TABLE devices ADD COLUMN attachments JSONB DEFAULT '[]'::jsonb;
    END IF;
    
    -- Sprawdź czy kolumna thumbnail istnieje, jeśli nie - dodaj
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'devices' AND column_name = 'thumbnail') THEN
        ALTER TABLE devices ADD COLUMN thumbnail TEXT;
    END IF;
END
$$;

-- Dla tabeli service_records
DO $$
BEGIN
    -- Sprawdź czy kolumna images istnieje, jeśli nie - dodaj
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'service_records' AND column_name = 'images') THEN
        ALTER TABLE service_records ADD COLUMN images JSONB DEFAULT '[]'::jsonb;
    END IF;
    
    -- Sprawdź czy kolumna attachments istnieje, jeśli nie - dodaj
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'service_records' AND column_name = 'attachments') THEN
        ALTER TABLE service_records ADD COLUMN attachments JSONB DEFAULT '[]'::jsonb;
    END IF;
END
$$;
