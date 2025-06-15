
-- Aktywuj RLS dla tabel (jeśli jeszcze nieaktywna):
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_records ENABLE ROW LEVEL SECURITY;

-- Polityka: Zezwól na zapisywanie/odczytywanie WSZYSTKIM użytkownikom (otwarta polityka, do testów)
CREATE POLICY "Allow all on vehicles" ON public.vehicles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on devices" ON public.devices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on service_records" ON public.service_records FOR ALL USING (true) WITH CHECK (true);
