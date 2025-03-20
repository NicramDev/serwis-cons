
import { useEffect, useState } from 'react';
import { Bell, Calendar, Car, CheckSquare, Info } from 'lucide-react';
import { Vehicle } from '../utils/types';
import { formatDate } from '../utils/data';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const Notifications = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  
  useEffect(() => {
    // Load vehicles from localStorage
    const savedVehicles = localStorage.getItem('vehicles');
    const loadedVehicles = savedVehicles ? JSON.parse(savedVehicles) : [];
    setVehicles(loadedVehicles);
    
    // Generate notifications from vehicle data
    const now = new Date();
    const allNotifications: any[] = [];
    
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
            message: `Ubezpieczenie OC/AC pojazdu ${vehicle.name} wygasa za ${daysToInsuranceExpiry} dni`
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
            expired: true
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
            message: `Przegląd pojazdu ${vehicle.name} wygasa za ${daysToInspectionExpiry} dni`
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
            expired: true
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
            message: `Serwis pojazdu ${vehicle.name} wygasa za ${daysToServiceExpiry} dni`
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
            expired: true
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
  
  const getNotificationIcon = (type: string, expired: boolean) => {
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
      default:
        return <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center"><Bell className="h-5 w-5" /></div>;
    }
  };
  
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success("Powiadomienie oznaczono jako przeczytane");
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
                  {getNotificationIcon(notification.type, notification.expired)}
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={notification.expired ? "destructive" : "outline"} className="font-normal">
                        {notification.type === 'insurance' ? 'Ubezpieczenie' : 
                         notification.type === 'inspection' ? 'Przegląd' : 'Serwis'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(notification.date)}
                      </span>
                    </div>
                    
                    <p className="font-medium mb-1">{notification.message}</p>
                    <p className="text-sm text-muted-foreground">Pojazd: {notification.vehicleName}</p>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="text-xs"
                  >
                    Oznacz jako przeczytane
                  </Button>
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
              Nie masz żadnych aktywnych powiadomień. Powiadomienia pojawią się, gdy zbliżą się terminy przeglądów, ubezpieczeń lub serwisów pojazdów.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
