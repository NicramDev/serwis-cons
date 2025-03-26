
import React from 'react';
import { Vehicle, Device, ServiceRecord } from '../utils/types';
import { Wrench, Cpu } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VehicleDetailHeader from './VehicleDetailHeader';
import VehicleSummaryInfo from './VehicleSummaryInfo';
import VehicleDeviceSection from './VehicleDeviceSection';
import VehicleServiceSection from './VehicleServiceSection';
import NoVehicleSelected from './NoVehicleSelected';

interface VehicleDetailPanelProps {
  selectedVehicleId: string | null;
  vehicles: Vehicle[];
  devices: Device[];
  services: ServiceRecord[];
  showingServiceRecords: boolean;
  onServiceClick: () => void;
  onEdit: (vehicle: Vehicle) => void;
  onAddService: () => void;
  onAddDevice?: () => void;
  onEditDevice?: (device: Device) => void;
  onDeleteDevice?: (device: Device) => void;
  onViewDevice?: (device: Device) => void;
  onEditService?: (service: ServiceRecord) => void;
  onDeleteService?: (service: ServiceRecord) => void;
  onViewService?: (service: ServiceRecord) => void;
  onSaveService?: () => void;
  onView?: (vehicle: Vehicle) => void;
}

const VehicleDetailPanel = ({
  selectedVehicleId,
  vehicles,
  devices,
  services,
  showingServiceRecords,
  onServiceClick,
  onEdit,
  onAddService,
  onAddDevice,
  onEditDevice,
  onDeleteDevice,
  onViewDevice,
  onEditService,
  onDeleteService,
  onViewService,
  onSaveService,
  onView
}: VehicleDetailPanelProps) => {
  // Function to open attachments in a new tab/window
  const handleAttachmentOpen = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer,fullscreen=yes');
  };

  if (!selectedVehicleId) {
    return <NoVehicleSelected />;
  }

  const vehicle = vehicles.find(v => v.id === selectedVehicleId);
  if (!vehicle) return null;

  const selectedVehicleDevices = devices.filter(device => device.vehicleId === selectedVehicleId);
  
  return (
    <Card className="w-full border border-border/50 shadow-sm bg-white/80 backdrop-blur-sm animate-in fade-in-50 slide-in-from-right-5">
      <CardContent className="p-6">
        <div className="space-y-6">
          <VehicleDetailHeader 
            vehicle={vehicle} 
            showingServiceRecords={showingServiceRecords} 
            onServiceClick={onServiceClick} 
          />
          
          <VehicleSummaryInfo vehicle={vehicle} />
          
          <div className="pt-4 border-t border-border/50">
            {!showingServiceRecords ? (
              <VehicleDeviceSection 
                devices={selectedVehicleDevices}
                onAddDevice={onAddDevice}
                onEditDevice={onEditDevice}
                onDeleteDevice={onDeleteDevice}
                onViewDevice={onViewDevice}
                onOpenAttachment={handleAttachmentOpen}
              />
            ) : (
              <VehicleServiceSection 
                services={services}
                onAddService={onAddService}
                onEditService={onEditService}
                onDeleteService={onDeleteService}
                onViewService={onViewService}
                onOpenAttachment={handleAttachmentOpen}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleDetailPanel;
