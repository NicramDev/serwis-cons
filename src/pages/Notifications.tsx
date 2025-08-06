
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import NotificationItem from '@/components/notification/NotificationItem';
import EmptyNotifications from '@/components/notification/EmptyNotifications';
import { useNotifications } from '@/hooks/useNotifications';

const Notifications = () => {
  const navigate = useNavigate();
  const { notifications, loading, markAsRead } = useNotifications();
  
  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
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
  
  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Powiadomienia</h1>
            <p className="text-muted-foreground">Ładowanie powiadomień...</p>
          </div>
        </div>
      </div>
    );
  }

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
