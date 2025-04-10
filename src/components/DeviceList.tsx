import React from 'react';
import { Device } from '../utils/types';
import { Edit, Trash2, Eye, FileText, MoveRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DeviceCard from './DeviceCard';

interface DeviceListProps {
  devices: Device[];
  onEditDevice?: (device: Device) => void;
  onDeleteDevice?: (device: Device) => void;
  onViewDevice?: (device: Device) => void;
  onOpenAttachment?: (url: string) => void;
  onMoveDevice?: (device: Device) => void;
}

const DeviceList = ({ 
  devices, 
  onEditDevice, 
  onDeleteDevice, 
  onViewDevice,
  onOpenAttachment,
  onMoveDevice
}: DeviceListProps) => {
  if (devices.length === 0) {
    return (
      <div className="p-4 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50 text-center">
        <p className="text-sm text-muted-foreground">Brak przypisanych urządzeń do tego pojazdu.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {devices.map(device => (
        <DeviceCard 
          key={device.id}
          device={device}
          actions={
            <>
              {onViewDevice && (
                <Button
                  variant="outline"
                  size="xs"
                  className="h-7 px-2 text-xs"
                  onClick={() => onViewDevice(device)}
                >
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  Podgląd
                </Button>
              )}
              {onMoveDevice && (
                <Button
                  variant="outline"
                  size="xs"
                  className="h-7 px-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveDevice(device);
                  }}
                >
                  <MoveRight className="h-3.5 w-3.5 mr-1" />
                  Przenieś
                </Button>
              )}
              {onEditDevice && (
                <Button
                  variant="outline"
                  size="xs"
                  className="h-7 px-2 text-xs"
                  onClick={() => onEditDevice(device)}
                >
                  <Edit className="h-3.5 w-3.5 mr-1" />
                  Edytuj
                </Button>
              )}
              {onDeleteDevice && (
                <Button
                  variant="destructive"
                  size="xs"
                  className="h-7 px-2 text-xs"
                  onClick={() => onDeleteDevice(device)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Usuń
                </Button>
              )}
            </>
          }
          onAttachmentClick={onOpenAttachment}
        />
      ))}
    </div>
  );
};

export default DeviceList;
