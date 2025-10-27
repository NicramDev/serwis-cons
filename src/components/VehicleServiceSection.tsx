
import React, { useState } from 'react';
import { ServiceRecord, Device } from '../utils/types';
import { Wrench, PlusCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ServiceRecordList from './ServiceRecordList';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [filterType, setFilterType] = useState<'all' | 'vehicle' | 'device'>('all');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  // Filter services based on the selected filter type and device
  const filteredServices = services.filter(service => {
    if (filterType === 'all') return true;
    if (filterType === 'vehicle') return !service.deviceId;
    if (filterType === 'device') {
      // Show all device services or specific device if selected
      if (!selectedDeviceId) return !!service.deviceId;
      return service.deviceId === selectedDeviceId;
    }
    return true;
  });

  // Sort services by date - newest first
  const sortedServices = [...filteredServices].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
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

      <div className="mb-4 p-4 bg-white/60 rounded-lg border border-border/30 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filtruj serwisy:</span>
        </div>

        <div className="mb-3">
          <RadioGroup 
            defaultValue="all" 
            className="flex gap-4"
            value={filterType}
            onValueChange={(value) => {
              setFilterType(value as 'all' | 'vehicle' | 'device');
              if (value !== 'device') {
                setSelectedDeviceId(null);
              }
            }}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">Wszystkie</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="vehicle" id="vehicle" />
              <Label htmlFor="vehicle">Tylko pojazd</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="device" id="device" />
              <Label htmlFor="device">Urządzenie</Label>
            </div>
          </RadioGroup>
        </div>
          
        {filterType === 'device' && vehicleDevices.length > 0 && (
          <div className="mt-3">
            <div className="space-y-2">
              <Label htmlFor="device-select" className="text-sm mb-2 block">Wybierz konkretne urządzenie (opcjonalnie):</Label>
              <Select
                value={selectedDeviceId || "all"}
                onValueChange={(value) => setSelectedDeviceId(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Wszystkie urządzenia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    Wszystkie urządzenia
                  </SelectItem>
                  {vehicleDevices.map((device) => (
                    <SelectItem key={device.id} value={device.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          {device.thumbnail ? (
                            <AvatarImage src={device.thumbnail} alt={device.name} />
                          ) : (
                            <AvatarFallback>{device.name.substring(0, 2)}</AvatarFallback>
                          )}
                        </Avatar>
                        <span>{device.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
      
      <ServiceRecordList 
        services={sortedServices}
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
