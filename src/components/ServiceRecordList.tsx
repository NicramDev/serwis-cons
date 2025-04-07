
import React from 'react';
import { ServiceRecord, Device } from '../utils/types';
import { formatDate } from '../utils/formatting/dateUtils';
import { CalendarDays, Wrench, Car, Zap, Edit, Trash2, Eye, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

interface ServiceRecordListProps {
  services: ServiceRecord[];
  devices?: Device[];
  onEditService?: (service: ServiceRecord) => void;
  onDeleteService?: (service: ServiceRecord) => void;
  onViewService?: (service: ServiceRecord) => void;
  onOpenAttachment?: (url: string) => void;
}

const ServiceRecordList = ({ 
  services, 
  devices = [],
  onEditService, 
  onDeleteService, 
  onViewService,
  onOpenAttachment 
}: ServiceRecordListProps) => {
  if (services.length === 0) {
    return (
      <div className="p-4 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50 text-center">
        <p className="text-sm text-muted-foreground">Brak historii serwisowej dla tego pojazdu.</p>
      </div>
    );
  }

  // Helper function to find device by ID
  const findDevice = (deviceId?: string) => {
    if (!deviceId) return null;
    return devices.find(device => device.id === deviceId);
  };
  
  // Helper function to get service type display text
  const getServiceTypeText = (type: string) => {
    switch (type) {
      case 'repair':
        return 'Naprawa';
      case 'maintenance':
        return 'Serwis'; // Changed from 'Konserwacja' to 'Serwis'
      case 'inspection':
        return 'Przegląd';
      default:
        return 'Inne';
    }
  };
  
  // Helper function to get service type color
  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case 'repair':
        return 'bg-orange-100 text-orange-700';
      case 'maintenance':
        return 'bg-blue-100 text-blue-700';
      case 'inspection':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  
  return (
    <div className="space-y-3">
      {services.map((service) => {
        const device = service.deviceId ? findDevice(service.deviceId) : null;
        
        return (
          <div 
            key={service.id} 
            className="p-3 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm border border-border/50 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{formatDate(service.date)}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getServiceTypeColor(service.type)}`}>
                    {getServiceTypeText(service.type)}
                  </span>
                </div>
                <div className="flex items-start gap-4">
                  {service.deviceId && device?.thumbnail ? (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className="h-12 w-12 rounded-md overflow-hidden bg-background/50 flex-shrink-0 flex items-center justify-center border border-border/30 cursor-pointer">
                          <img 
                            src={device.thumbnail} 
                            alt={service.deviceName || 'Device'}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder.svg';
                            }}
                          />
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-auto p-0 border-none">
                        <div className="w-48 h-48 overflow-hidden flex items-center justify-center bg-background">
                          <img 
                            src={device.thumbnail} 
                            alt={service.deviceName || 'Device'} 
                            className="max-w-full max-h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder.svg';
                            }}
                          />
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ) : service.deviceName ? (
                    <div className="h-12 w-12 rounded-md overflow-hidden bg-background/50 flex-shrink-0 flex items-center justify-center border border-border/30">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                    </div>
                  ) : (
                    <Car className="h-5 w-5 mt-1" />
                  )}
                  <div>
                    <h4 className="font-medium">
                      {service.deviceName || 'Pojazd'}
                    </h4>
                    <p className="text-sm mt-1">{service.description}</p>
                    
                    {/* Added information about what the service relates to */}
                    <p className="text-xs text-muted-foreground mt-1">
                      Dotyczy: {service.deviceId ? 'Urządzenia' : 'Pojazdu'}
                      {service.deviceName && ` - ${service.deviceName}`}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {onViewService && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 px-2 text-xs"
                    onClick={() => onViewService(service)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Podgląd
                  </Button>
                )}
                {onEditService && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 px-2 text-xs"
                    onClick={() => onEditService(service)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edytuj
                  </Button>
                )}
                {onDeleteService && (
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="h-7 px-2 text-xs"
                    onClick={() => onDeleteService(service)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Usuń
                  </Button>
                )}
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border/50 flex justify-between">
              <span className="text-xs text-muted-foreground">Technik: {service.technician}</span>
              <span className="text-xs font-medium">{service.cost.toFixed(2)} PLN</span>
            </div>
          </div>
        )
      })}
    </div>
  );
};

export default ServiceRecordList;
