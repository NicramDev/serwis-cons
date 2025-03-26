
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import NotificationItem from '@/components/notification/NotificationItem';
import EmptyNotifications from '@/components/notification/EmptyNotifications';
import { generateNotifications, saveNotifications } from '@/services/notificationService';
import { Device, Vehicle } from '../utils/types';

const Notifications = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load vehicles from localStorage
    const savedVehicles = localStorage.getItem('vehicles');
    const loadedVehicles = savedVehicles ? JSON.parse(savedVehicles) : [];
    setVehicles(loadedVehicles);
    
    // Load devices from localStorage
    const savedDevices = localStorage.getItem('devices');
    const loadedDevices = savedDevices ? JSON.parse(savedDevices) : [];
    setDevices(loadedDevices);
    
    // Generate notifications from vehicle and device data
    const allNotifications = generateNotifications(loadedVehicles, loadedDevices);
    setNotifications(allNotifications);
    
    // Save notifications to localStorage for the Navbar to use
    saveNotifications(allNotifications);
  }, []);
  
  const handleMarkAsRead = (id: string) => {
    const updatedNotifications = notifications.filter(n => n.id !== id);
    setNotifications(updatedNotifications);
    
    // Update localStorage with the updated notifications
    saveNotifications(updatedNotifications);
    
    toast.success("Powiadomienie oznaczono jako przeczytane");
  };

  const handleGoToItem = (notification: any) => {
    if (notification.itemType === 'vehicle' && notification.vehicleId) {
      // Navigate to vehicle page with edit mode parameter
      navigate(`/vehicles?vehicleId=${notification.vehicleId}&edit=true`);
    } else if (notification.itemType === 'device' && notification.deviceId) {
      // Navigate to devices page with edit mode parameter
      navigate(`/devices?deviceId=${notification.deviceId}&edit=true`);
    }
  };
  
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Powiadomienia</h1>
          <p className="text-muted-foreground">Przypomnienia o zbliżających się terminach przeglądów, ubezpieczeń i serwisów</p>
        </div>
        
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <NotificationItem 
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onGoToItem={handleGoToItem}
              />
            ))}
          </div>
        ) : (
          <EmptyNotifications />
        )}
      </div>
    </div>
  );
};

export default Notifications;
