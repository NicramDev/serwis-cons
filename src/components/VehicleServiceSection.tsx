
import React, { useState } from 'react';
import { ServiceRecord, Device } from '../utils/types';
import { Wrench, PlusCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ServiceRecordList from './ServiceRecordList';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VehicleServiceSectionProps {
  services: ServiceRecord[];
  devices?: Device[];
  onAddService: () => void;
  onEditService?: (service: ServiceRecord) => void;
  onDeleteService?: (service: ServiceRecord) => void;
  onViewService?: (service: ServiceRecord) => void;
  onOpenAttachment: (url: string) => void;
}

const VehicleServiceSection = ({
  services,
  devices,
  onAddService,
  onEditService,
  onDeleteService,
  onViewService,
  onOpenAttachment
}: VehicleServiceSectionProps) => {
  const [serviceFilter, setServiceFilter] = useState<'all' | 'vehicle' | 'device' | string>('all');

  // Filter services based on the selected filter
  const filteredServices = services.filter(service => {
    if (serviceFilter === 'all') return true;
    if (serviceFilter === 'vehicle') return !service.deviceId;
    if (serviceFilter === 'device') return Boolean(service.deviceId);
    return service.deviceId === serviceFilter;
  });

  // Get unique devices that have services
  const devicesWithServices = devices?.filter(
    device => services.some(service => service.deviceId === device.id)
  ) || [];

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <Wrench className="h-4 w-4" />
          <span>Historia serwisowa ({services.length})</span>
        </div>
        
        <Button 
          size="sm" 
          onClick={onAddService}
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Dodaj serwis/naprawę
        </Button>
      </div>

      <div className="flex items-center justify-between mb-4 bg-muted/20 p-2 rounded-md">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filtruj serwisy:</span>
        </div>
        
        <Select 
          value={serviceFilter} 
          onValueChange={setServiceFilter}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Wszystkie serwisy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszystkie serwisy</SelectItem>
            <SelectItem value="vehicle">Tylko serwisy pojazdu</SelectItem>
            <SelectItem value="device">Tylko serwisy urządzeń</SelectItem>
            {devicesWithServices.map(device => (
              <SelectItem key={device.id} value={device.id}>
                {device.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <ServiceRecordList 
        services={filteredServices}
        devices={devices}
        onEditService={onEditService}
        onDeleteService={onDeleteService}
        onViewService={onViewService}
        onOpenAttachment={onOpenAttachment}
      />
    </>
  );
};

export default VehicleServiceSection;
