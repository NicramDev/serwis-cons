
import React from 'react';
import { Bell, Calendar, Car, CheckSquare, Info, Zap, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/data';

interface NotificationItemProps {
  notification: any;
  onMarkAsRead: (id: string) => void;
  onGoToItem: (notification: any) => void;
}

export const NotificationItem = ({ notification, onMarkAsRead, onGoToItem }: NotificationItemProps) => {
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

  return (
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
            onClick={() => onGoToItem(notification)}
            className="flex items-center gap-1"
          >
            Przejdź
            <ArrowRight className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onMarkAsRead(notification.id)}
            className="text-xs"
          >
            Oznacz jako przeczytane
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default NotificationItem;
