
import React, { useState } from 'react';
import { ServiceRecord, Device } from '../utils/types';
import { Wrench, PlusCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ServiceRecordList from './ServiceRecordList';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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
  const [serviceFilter, setServiceFilter] = useState<'all' | 'vehicle' | string>('vehicle');

  // Filter services based on the selected filter
  const filteredServices = services.filter(service => {
    if (serviceFilter === 'all') return true;
    if (serviceFilter === 'vehicle') return !service.deviceId;
    return service.deviceId === serviceFilter; // This is a device ID
  });

  // Get devices for this vehicle
  const vehicleDevices = devices || [];
  
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

      <div className="mb-4 bg-muted/20 p-3 rounded-md space-y-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filtruj serwisy:</span>
        </div>
        
        <RadioGroup 
          value={serviceFilter} 
          onValueChange={setServiceFilter}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <label htmlFor="all" className="text-sm cursor-pointer">Wszystkie serwisy</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="vehicle" id="vehicle" />
            <label htmlFor="vehicle" className="text-sm cursor-pointer">Tylko serwisy pojazdu</label>
          </div>
          
          {vehicleDevices.length > 0 && (
            <div className="pt-1 border-t border-border/30">
              <p className="text-xs text-muted-foreground mb-2 mt-1">Serwisy urządzeń:</p>
              {vehicleDevices.map(device => (
                <div key={device.id} className="flex items-center space-x-2 ml-1 mb-1.5">
                  <RadioGroupItem value={device.id} id={device.id} />
                  <label htmlFor={device.id} className="text-sm cursor-pointer flex items-center">
                    {device.thumbnail ? (
                      <div className="w-6 h-6 mr-1.5 overflow-hidden rounded-sm">
                        <img 
                          src={device.thumbnail} 
                          alt={device.name} 
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                    ) : null}
                    {device.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </RadioGroup>
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
