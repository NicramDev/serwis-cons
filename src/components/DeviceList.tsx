import React from 'react';
import { Device } from '../utils/types';
import { Edit, Trash2, Eye, FileText, MoveRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DeviceCard from './DeviceCard';
interface DeviceListProps {
  devices: Device[];
  onEditDevice?: (device: Device) => void;
  onDeleteDevice?: (device: Device) => void;
  onViewDevice?: (device: Device) => void;
  onOpenAttachment?: (url: string) => void;
  onMoveDevice?: (device: Device) => void;
  onConvertToEquipment?: (device: Device) => void;
}
const DeviceList = ({
  devices,
  onEditDevice,
  onDeleteDevice,
  onViewDevice,
  onOpenAttachment,
  onMoveDevice,
  onConvertToEquipment
}: DeviceListProps) => {
  if (devices.length === 0) {
    return <div className="p-4 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50 text-center">
        <p className="text-sm text-muted-foreground">Brak przypisanych urządzeń do tego pojazdu.</p>
      </div>;
  }
  const sortedDevices = [...devices].sort((a, b) => a.name.localeCompare(b.name));
  return <div className="flex flex-col gap-3">
      {sortedDevices.map(device => <DeviceCard key={device.id} device={device} actions={<>
              {onViewDevice && <Button variant="outline" size="sm" onClick={() => onViewDevice(device)} className="h-7 text-xs px-[40px]">
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  Podgląd
                </Button>}
              {onMoveDevice && <Button variant="outline" size="sm" onClick={e => {
        e.stopPropagation();
        onMoveDevice(device);
      }} className="h-7 text-xs px-[40px]">
                  <MoveRight className="h-3.5 w-3.5 mr-1" />
                  Przenieś
                </Button>}
               {onConvertToEquipment && <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={e => {
        e.stopPropagation();
        onConvertToEquipment(device);
      }}>
                   <Package className="h-3.5 w-3.5 mr-1" />
                   Do wyposażenia
                 </Button>}
               {onEditDevice && <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => onEditDevice(device)}>
                  <Edit className="h-3.5 w-3.5 mr-1" />
                  Edytuj
                </Button>}
              {onDeleteDevice && <Button variant="destructive" size="sm" className="h-7 px-2 text-xs" onClick={() => onDeleteDevice(device)}>
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Usuń
                </Button>}
            </>} onAttachmentClick={onOpenAttachment} />)}
    </div>;
};
export default DeviceList;