
import React from 'react';
import { Device } from '../utils/types';
import { Cpu, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DeviceList from './DeviceList';

interface VehicleDeviceSectionProps {
  devices: Device[];
  onAddDevice?: () => void;
  onEditDevice?: (device: Device) => void;
  onDeleteDevice?: (device: Device) => void;
  onViewDevice?: (device: Device) => void;
  onOpenAttachment: (url: string) => void;
}

const VehicleDeviceSection = ({
  devices,
  onAddDevice,
  onEditDevice,
  onDeleteDevice,
  onViewDevice,
  onOpenAttachment
}: VehicleDeviceSectionProps) => {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <Cpu className="h-4 w-4" />
          <span>Przypisane urządzenia ({devices.length})</span>
        </div>
        
        {onAddDevice && (
          <Button 
            size="sm" 
            onClick={onAddDevice}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Dodaj urządzenie
          </Button>
        )}
      </div>
      
      <DeviceList 
        devices={devices} 
        onEditDevice={onEditDevice}
        onDeleteDevice={onDeleteDevice}
        onViewDevice={onViewDevice}
        onOpenAttachment={onOpenAttachment}
      />
    </>
  );
};

export default VehicleDeviceSection;
