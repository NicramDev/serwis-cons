import { Device, Vehicle } from '@/utils/types';
import { supabase } from "@/integrations/supabase/client";
import { mapSupabaseDeviceToDevice, mapDeviceToSupabaseDevice } from '@/utils/supabaseMappers';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export const useDeviceOperations = () => {
  const addDevice = async (deviceData: Partial<Device>) => {
    const newDeviceData: Partial<Device> = {
      ...deviceData,
      id: uuidv4(),
      lastService: deviceData.lastService || new Date(),
      nextService: deviceData.nextService || new Date(new Date().setMonth(new Date().getMonth() + 6)),
      status: 'ok',
    };

    const supabaseDevice = mapDeviceToSupabaseDevice(newDeviceData);
    
    const { data, error } = await supabase
      .from('devices')
      .insert(supabaseDevice)
      .select()
      .single();

    if (error) {
      toast.error("Nie udało się dodać urządzenia.");
      throw error;
    }
    
    toast.success("Urządzenie zostało dodane pomyślnie");
    return mapSupabaseDeviceToDevice(data);
  };

  const updateDevice = async (updatedDeviceData: Device) => {
    const supabaseDevice = mapDeviceToSupabaseDevice(updatedDeviceData);
    delete supabaseDevice.id;

    const { data, error } = await supabase
      .from('devices')
      .update(supabaseDevice)
      .eq('id', updatedDeviceData.id)
      .select()
      .single();

    if (error) {
      toast.error("Nie udało się zaktualizować urządzenia.");
      throw error;
    }

    toast.success("Urządzenie zostało zaktualizowane pomyślnie");
    return mapSupabaseDeviceToDevice(data);
  };

  const deleteDevice = async (deviceId: string) => {
    const { error } = await supabase.from('devices').delete().eq('id', deviceId);

    if (error) {
      toast.error("Nie udało się usunąć urządzenia.");
      throw error;
    }
    
    toast.success("Urządzenie zostało usunięte pomyślnie");
  };

  return { addDevice, updateDevice, deleteDevice };
};