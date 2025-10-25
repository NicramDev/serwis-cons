
import React from 'react';
import { ServiceRecord, Device } from '../utils/types';
import { formatDate } from '../utils/formatting/dateUtils';
import { CalendarDays, Wrench, Car, Zap, Edit, Trash2, Eye, Smartphone, FileImage, FileText, File, ExternalLink } from 'lucide-react';
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
        return 'Serwis';
      case 'inspection':
        return 'Przegląd';
      case 'replacement':
        return 'Wymiana';
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
      case 'replacement':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Helper function to get appropriate icon based on file type
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <FileImage className="h-4 w-4 text-blue-500" />;
    } else if (fileType === 'application/pdf') {
      return <FileText className="h-4 w-4 text-red-500" />;
    } else {
      return <File className="h-4 w-4 text-gray-500" />;
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
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{formatDate(service.date)}</span>
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

                  {/* Attachment thumbnails */}
                  {service.attachments && service.attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {service.attachments.slice(0, 3).map((attachment, idx) => (
                        <div 
                          key={idx} 
                          className="h-6 w-6 rounded-md overflow-hidden border border-border/50 flex items-center justify-center bg-muted cursor-pointer"
                          onClick={() => onOpenAttachment && onOpenAttachment(attachment.url)}
                          title={attachment.name}
                        >
                          {attachment.type.startsWith('image/') ? (
                            <img 
                              src={attachment.url} 
                              alt={attachment.name} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            getFileIcon(attachment.type)
                          )}
                        </div>
                      ))}
                      {service.attachments.length > 3 && (
                        <div className="h-6 px-1 rounded-md overflow-hidden border border-border/50 flex items-center justify-center bg-muted text-xs">
                          +{service.attachments.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">Typ:</span>
                  <span className="text-sm font-bold text-black dark:text-white">{getServiceTypeText(service.type)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">Koszt:</span>
                  <span className="text-sm font-bold text-black dark:text-white">{service.cost.toFixed(2)} PLN</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-1">
                {onViewService && (
                  <Button 
                    variant="secondary"
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
                    Edycja
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
          </div>
        )
      })}
    </div>
  );
};

export default ServiceRecordList;
