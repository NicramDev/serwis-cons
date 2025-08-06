import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { generateNotifications } from '@/services/notificationService';
import { mapSupabaseVehicleToVehicle, mapSupabaseDeviceToDevice } from '@/utils/supabaseMappers';
import { Vehicle, Device } from '@/utils/types';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      
      // Fetch vehicles from Supabase
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (vehiclesError) {
        console.error('Error fetching vehicles:', vehiclesError);
        return;
      }

      // Fetch devices from Supabase
      const { data: devicesData, error: devicesError } = await supabase
        .from('devices')
        .select('*')
        .order('created_at', { ascending: false });

      if (devicesError) {
        console.error('Error fetching devices:', devicesError);
        return;
      }

      // Map data to proper format
      const vehicles: Vehicle[] = vehiclesData?.map(mapSupabaseVehicleToVehicle) || [];
      const devices: Device[] = devicesData?.map(mapSupabaseDeviceToDevice) || [];

      // Generate notifications
      const allNotifications = generateNotifications(vehicles, devices);
      setNotifications(allNotifications);
      
      // Save to localStorage for navbar badge
      localStorage.setItem('notifications', JSON.stringify(allNotifications));
      
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.filter(n => n.id !== id);
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const refreshNotifications = () => {
    loadNotifications();
  };

  return {
    notifications,
    loading,
    markAsRead,
    refreshNotifications
  };
};