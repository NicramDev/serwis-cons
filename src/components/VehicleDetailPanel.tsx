
import React, { useState } from 'react';
import { Vehicle, Device, ServiceRecord } from '../utils/types';
import { Wrench, Cpu, FileText } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VehicleDetailHeader from './VehicleDetailHeader';
import VehicleSummaryInfo from './VehicleSummaryInfo';
import VehicleDeviceSection from './VehicleDeviceSection';
import VehicleServiceSection from './VehicleServiceSection';
import NoVehicleSelected from './NoVehicleSelected';
import VehicleReportForm from './VehicleReportForm';

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
  const [showReportForm, setShowReportForm] = useState(false);
  
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
  const selectedVehicleServices = services.filter(service => service.vehicleId === selectedVehicleId);
  
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
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                {showingServiceRecords ? (
                  <>
                    <Wrench className="h-4 w-4" />
                    <span>Historia serwisowa ({selectedVehicleServices.length})</span>
                  </>
                ) : (
                  <>
                    <Cpu className="h-4 w-4" />
                    <span>Urządzenia ({selectedVehicleDevices.length})</span>
                  </>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowReportForm(true)}
                  className="inline-flex items-center gap-1 bg-white text-primary hover:bg-gray-50 text-sm px-3 py-1.5 rounded-md border border-border shadow-sm transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  Zestawienia
                </button>
              </div>
            </div>
            
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
                services={selectedVehicleServices}
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
      
      {showReportForm && (
        <VehicleReportForm
          open={showReportForm}
          onClose={() => setShowReportForm(false)}
          vehicle={vehicle}
          devices={selectedVehicleDevices}
          services={selectedVehicleServices}
        />
      )}
    </Card>
  );
};

export default VehicleDetailPanel;
