
import React, { useState } from 'react';
import { Vehicle, Device, ServiceRecord } from '../utils/types';
import { Wrench, Cpu, FileText } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  
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
    <>
      <Card className="w-full border border-border/50 shadow-sm bg-white/80 backdrop-blur-sm animate-in fade-in-50 slide-in-from-right-5">
        <CardContent className="p-6">
          <div className="space-y-6">
            <VehicleDetailHeader 
              vehicle={vehicle} 
              showingServiceRecords={showingServiceRecords} 
              onServiceClick={onServiceClick} 
            />
            
            <VehicleSummaryInfo vehicle={vehicle} />
            
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-border/50">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={onServiceClick}
                  className={`px-3 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${
                    showingServiceRecords
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
                >
                  <Wrench className="h-4 w-4" />
                  Serwisy
                </button>
                
                <button
                  onClick={onServiceClick}
                  className={`px-3 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${
                    !showingServiceRecords
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
                >
                  <Cpu className="h-4 w-4" />
                  Urządzenia
                </button>
                
                <button
                  onClick={() => setIsReportDialogOpen(true)}
                  className="px-3 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors bg-secondary hover:bg-secondary/80"
                >
                  <FileText className="h-4 w-4" />
                  Zestawienia
                </button>
              </div>
            </div>
            
            <div className="pt-4">
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
      
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Zestawienie dla pojazdu {vehicle.name}</DialogTitle>
            <DialogDescription>
              Wybierz rodzaj zestawienia, które chcesz wygenerować.
            </DialogDescription>
          </DialogHeader>
          <VehicleReportForm 
            vehicle={vehicle} 
            devices={selectedVehicleDevices} 
            services={services}
            onClose={() => setIsReportDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VehicleDetailPanel;
