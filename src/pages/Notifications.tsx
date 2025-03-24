import { useEffect, useState } from 'react';
import { Bell, Calendar, Car, CheckSquare, Info, Zap, ArrowRight } from 'lucide-react';
import { Device, Vehicle } from '../utils/types';
import { formatDate } from '../utils/data';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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
    const now = new Date();
    const allNotifications: any[] = [];
    
    // Process vehicle notifications
    loadedVehicles.forEach((vehicle: Vehicle) => {
      // Insurance notifications
      if (vehicle.insuranceExpiryDate) {
        const insuranceDate = new Date(vehicle.insuranceExpiryDate);
        const daysToInsuranceExpiry = Math.floor((insuranceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysToInsuranceExpiry <= (vehicle.insuranceReminderDays || 30) && daysToInsuranceExpiry >= 0) {
          allNotifications.push({
            id: `insurance-${vehicle.id}`,
            vehicleId: vehicle.id,
            vehicleName: vehicle.name,
            type: 'insurance',
            date: insuranceDate,
            daysLeft: daysToInsuranceExpiry,
            message: `Ubezpieczenie OC/AC pojazdu ${vehicle.name} wygasa za ${daysToInsuranceExpiry} dni`,
            itemType: 'vehicle'
          });
        } else if (daysToInsuranceExpiry < 0) {
          allNotifications.push({
            id: `insurance-${vehicle.id}`,
            vehicleId: vehicle.id,
            vehicleName: vehicle.name,
            type: 'insurance',
            date: insuranceDate,
            daysLeft: daysToInsuranceExpiry,
            message: `Ubezpieczenie OC/AC pojazdu ${vehicle.name} wygasło ${Math.abs(daysToInsuranceExpiry)} dni temu`,
            expired: true,
            itemType: 'vehicle'
          });
        }
      }
      
      // Inspection notifications
      if (vehicle.inspectionExpiryDate) {
        const inspectionDate = new Date(vehicle.inspectionExpiryDate);
        const daysToInspectionExpiry = Math.floor((inspectionDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysToInspectionExpiry <= (vehicle.inspectionReminderDays || 30) && daysToInspectionExpiry >= 0) {
          allNotifications.push({
            id: `inspection-${vehicle.id}`,
            vehicleId: vehicle.id,
            vehicleName: vehicle.name,
            type: 'inspection',
            date: inspectionDate,
            daysLeft: daysToInspectionExpiry,
            message: `Przegląd pojazdu ${vehicle.name} wygasa za ${daysToInspectionExpiry} dni`,
            itemType: 'vehicle'
          });
        } else if (daysToInspectionExpiry < 0) {
          allNotifications.push({
            id: `inspection-${vehicle.id}`,
            vehicleId: vehicle.id,
            vehicleName: vehicle.name,
            type: 'inspection',
            date: inspectionDate,
            daysLeft: daysToInspectionExpiry,
            message: `Przegląd pojazdu ${vehicle.name} wygasł ${Math.abs(daysToInspectionExpiry)} dni temu`,
            expired: true,
            itemType: 'vehicle'
          });
        }
      }
      
      // Service notifications
      if (vehicle.serviceExpiryDate) {
        const serviceDate = new Date(vehicle.serviceExpiryDate);
        const daysToServiceExpiry = Math.floor((serviceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysToServiceExpiry <= (vehicle.serviceReminderDays || 30) && daysToServiceExpiry >= 0) {
          allNotifications.push({
            id: `service-${vehicle.id}`,
            vehicleId: vehicle.id,
            vehicleName: vehicle.name,
            type: 'service',
            date: serviceDate,
            daysLeft: daysToServiceExpiry,
            message: `Serwis pojazdu ${vehicle.name} wygasa za ${daysToServiceExpiry} dni`,
            itemType: 'vehicle'
          });
        } else if (daysToServiceExpiry < 0) {
          allNotifications.push({
            id: `service-${vehicle.id}`,
            vehicleId: vehicle.id,
            vehicleName: vehicle.name,
            type: 'service',
            date: serviceDate,
            daysLeft: daysToServiceExpiry,
            message: `Serwis pojazdu ${vehicle.name} wygasł ${Math.abs(daysToServiceExpiry)} dni temu`,
            expired: true,
            itemType: 'vehicle'
          });
        }
      }
    });
    
    // Process device notifications
    loadedDevices.forEach((device: Device) => {
      // Service notifications for devices
      if (device.serviceExpiryDate) {
        const serviceDate = new Date(device.serviceExpiryDate);
        const daysToServiceExpiry = Math.floor((serviceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        // Find vehicle name if device is attached to a vehicle
        let vehicleName = '';
        if (device.vehicleId) {
          const deviceVehicle = loadedVehicles.find((v: Vehicle) => v.id === device.vehicleId);
          if (deviceVehicle) {
            vehicleName = deviceVehicle.name;
          }
        }
        
        if (daysToServiceExpiry <= (device.serviceReminderDays || 30) && daysToServiceExpiry >= 0) {
          allNotifications.push({
            id: `device-service-${device.id}`,
            deviceId: device.id,
            deviceName: device.name,
            vehicleId: device.vehicleId,
            vehicleName: vehicleName,
            type: 'device-service',
            date: serviceDate,
            daysLeft: daysToServiceExpiry,
            message: `Serwis urządzenia ${device.name} wygasa za ${daysToServiceExpiry} dni`,
            itemType: 'device'
          });
        } else if (daysToServiceExpiry < 0) {
          allNotifications.push({
            id: `device-service-${device.id}`,
            deviceId: device.id,
            deviceName: device.name,
            vehicleId: device.vehicleId,
            vehicleName: vehicleName,
            type: 'device-service',
            date: serviceDate,
            daysLeft: daysToServiceExpiry,
            message: `Serwis urządzenia ${device.name} wygasł ${Math.abs(daysToServiceExpiry)} dni temu`,
            expired: true,
            itemType: 'device'
          });
        }
      }
    });
    
    // Sort notifications by days left
    allNotifications.sort((a, b) => {
      if (a.expired && !b.expired) return -1;
      if (!a.expired && b.expired) return 1;
      return a.daysLeft - b.daysLeft;
    });
    
    setNotifications(allNotifications);
  }, []);
  
  const getNotificationIcon = (type: string, expired: boolean, itemType: string) => {
    if (expired) {
      return <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600"><Info className="h-5 w-5" /></div>;
    }
    
    switch (type) {
      case 'insurance':
        return <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><CheckSquare className="h-5 w-5" /></div>;
      case 'inspection':
        return <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Car className="h-5 w-5" /></div>;
      case 'service':
        return <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600"><Calendar className="h-5 w-5" /></div>;
      case 'device-service':
        return <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"><Zap className="h-5 w-5" /></div>;
      default:
        return <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center"><Bell className="h-5 w-5" /></div>;
    }
  };
  
  const getNotificationTypeName = (type: string, itemType: string) => {
    switch (type) {
      case 'insurance':
        return 'Ubezpieczenie';
      case 'inspection':
        return 'Przegląd';
      case 'service':
        return 'Serwis';
      case 'device-service':
        return 'Serwis urządzenia';
      default:
        return 'Powiadomienie';
    }
  };
  
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
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
              <Card key={notification.id} className={`p-4 border ${notification.expired ? 'border-destructive/30' : 'border-border'}`}>
                <div className="flex items-start gap-4">
                  {getNotificationIcon(notification.type, notification.expired, notification.itemType)}
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={notification.expired ? "destructive" : "outline"} className="font-normal">
                        {getNotificationTypeName(notification.type, notification.itemType)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(notification.date)}
                      </span>
                    </div>
                    
                    <p className="font-medium mb-1">{notification.message}</p>
                    <p className="text-sm text-muted-foreground">
                      {notification.itemType === 'vehicle' 
                        ? `Pojazd: ${notification.vehicleName}` 
                        : `Urządzenie: ${notification.deviceName}${notification.vehicleName ? ` (Pojazd: ${notification.vehicleName})` : ''}`}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleGoToItem(notification)}
                      className="flex items-center gap-1"
                    >
                      Przejdź
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-xs"
                    >
                      Oznacz jako przeczytane
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-xl p-12 text-center">
            <div className="icon-container mx-auto mb-4">
              <Bell className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Brak powiadomień</h3>
            <p className="text-muted-foreground">
              Nie masz żadnych aktywnych powiadomień. Powiadomienia pojawią się, gdy zbliżą się terminy przeglądów, ubezpieczeń lub serwisów pojazdów i urządzeń.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
