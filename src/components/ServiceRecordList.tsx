
import React from 'react';
import { ServiceRecord } from '../utils/types';
import { formatDate } from '../utils/data';
import { CalendarDays, Wrench, Car, Zap, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ServiceRecordListProps {
  services: ServiceRecord[];
  onEditService?: (service: ServiceRecord) => void;
  onDeleteService?: (service: ServiceRecord) => void;
  onViewService?: (service: ServiceRecord) => void;
  onOpenAttachment?: (url: string) => void;
}

const ServiceRecordList = ({ 
  services, 
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

  return (
    <div className="space-y-3">
      {services.map((service) => (
        <div 
          key={service.id} 
          className="p-3 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm border border-border/50 hover:shadow-md transition-all"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{formatDate(service.date)}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                  {service.type === 'repair' ? 'Naprawa' : 
                   service.type === 'maintenance' ? 'Konserwacja' : 
                   'Przegląd'}
                </span>
              </div>
              <h4 className="font-medium">
                {service.deviceName ? (
                  <span className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    {service.deviceName}
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Car className="h-3 w-3" />
                    Pojazd
                  </span>
                )}
              </h4>
              <p className="text-sm mt-1">{service.description}</p>
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
      ))}
    </div>
  );
};

export default ServiceRecordList;
