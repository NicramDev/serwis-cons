import React from 'react';
import { Device } from '@/utils/types';
import { Search } from 'lucide-react';
import DeviceCard from './DeviceCard';

interface DeviceListSectionProps {
  devices: Device[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onEditDevice: (device: Device) => void;
  onDeleteDevice: (device: Device) => void;
  onViewDeviceDetails: (device: Device) => void;
}

const DeviceListSection = ({
  devices,
  searchQuery,
  setSearchQuery,
  onEditDevice,
  onDeleteDevice,
  onViewDeviceDetails
}: DeviceListSectionProps) => {
  const filteredDevices = devices
    .filter(device => 
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (device.model?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      device.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  if (filteredDevices.length === 0) {
    return (
      <div className="glass-card rounded-xl p-12 text-center">
        <div className="icon-container mx-auto mb-4">
          <Search className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-medium mb-2">Nie znaleziono urządzeń</h3>
        <p className="text-muted-foreground">
          Żadne urządzenia nie pasują do kryteriów wyszukiwania. Spróbuj innego zapytania lub dodaj nowe urządzenie.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      {filteredDevices.map((device, index) => (
        <DeviceCard 
          key={device.id} 
          device={device} 
          delay={index % 5 + 1} 
          onEdit={onEditDevice}
          onDelete={onDeleteDevice}
          onViewDetails={onViewDeviceDetails}
        />
      ))}
    </div>
  );
};

export default DeviceListSection;