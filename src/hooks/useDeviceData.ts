import { useState, useEffect } from 'react';
import { Device, Vehicle } from '@/utils/types';
import { supabase } from "@/integrations/supabase/client";
import { mapSupabaseDeviceToDevice, mapSupabaseVehicleToVehicle } from '@/utils/supabaseMappers';
import { toast } from 'sonner';

export const useDeviceData = () => {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [devicesRes, vehiclesRes] = await Promise.all([
          supabase.from('devices').select('*'),
          supabase.from('vehicles').select('*'),
        ]);

        if (devicesRes.error) {
          toast.error("Błąd pobierania urządzeń");
          console.error(devicesRes.error);
        } else {
          setAllDevices(devicesRes.data.map(mapSupabaseDeviceToDevice));
        }

        if (vehiclesRes.error) {
          toast.error("Błąd pobierania pojazdów");
          console.error(vehiclesRes.error);
        } else {
          setAllVehicles(vehiclesRes.data.map(mapSupabaseVehicleToVehicle));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error("Wystąpił błąd podczas pobierania danych");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { allDevices, setAllDevices, allVehicles, loading };
};