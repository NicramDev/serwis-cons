
import React from 'react';
import { ServiceRecord, Device } from '../utils/types';
import { Wrench, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ServiceRecordList from './ServiceRecordList';

interface VehicleServiceSectionProps {
  services: ServiceRecord[];
  devices?: Device[]; // Added devices array prop
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
  console.log("Devices in VehicleServiceSection:", devices);
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
      
      <ServiceRecordList 
        services={services}
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
