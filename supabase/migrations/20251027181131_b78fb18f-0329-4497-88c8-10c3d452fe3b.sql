-- Update all existing data to the logged-in user (consroad@cons.pl)
UPDATE public.vehicles 
SET user_id = '965ce76d-fe8a-4b54-ad2f-93d2e9a109de' 
WHERE user_id = '1eee98dd-33ca-49bd-b0ee-510a88acbf5b';

UPDATE public.devices 
SET user_id = '965ce76d-fe8a-4b54-ad2f-93d2e9a109de' 
WHERE user_id = '1eee98dd-33ca-49bd-b0ee-510a88acbf5b';

UPDATE public.equipment 
SET user_id = '965ce76d-fe8a-4b54-ad2f-93d2e9a109de' 
WHERE user_id = '1eee98dd-33ca-49bd-b0ee-510a88acbf5b';

UPDATE public.service_records 
SET user_id = '965ce76d-fe8a-4b54-ad2f-93d2e9a109de' 
WHERE user_id = '1eee98dd-33ca-49bd-b0ee-510a88acbf5b';

UPDATE public.vehicle_equipment 
SET user_id = '965ce76d-fe8a-4b54-ad2f-93d2e9a109de' 
WHERE user_id = '1eee98dd-33ca-49bd-b0ee-510a88acbf5b';