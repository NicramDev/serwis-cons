
import React, { useState } from 'react';
import { Vehicle, Device, ServiceRecord } from '../utils/types';
import { Card, CardContent } from "@/components/ui/card";
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
  onMoveDevice?: (device: Device, targetVehicleId: string) => void;
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
  onView,
  onMoveDevice
}: VehicleDetailPanelProps) => {
  const [showingReports, setShowingReports] = useState(false);
  const [reportFormOpen, setReportFormOpen] = useState(false);

  const handleAttachmentOpen = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer,fullscreen=yes');
  };

  const handleReportClick = () => {
    setShowingReports(!showingReports);
    setReportFormOpen(!reportFormOpen);
  };

  if (!selectedVehicleId) {
    return <NoVehicleSelected />;
  }

  const vehicle = vehicles.find(v => v.id === selectedVehicleId);
  if (!vehicle) return null;

  const selectedVehicleDevices = devices.filter(device => device.vehicleId === selectedVehicleId);
  const selectedVehicleServices = services.filter(service => service.vehicleId === selectedVehicleId);
  
  return (
    <>
      <Card className="w-full border border-border/50 shadow-sm bg-white/80 backdrop-blur-sm animate-in fade-in-50 slide-in-from-right-5">
        <CardContent className="p-6">
          <div className="space-y-6">
            <VehicleDetailHeader 
              vehicle={vehicle} 
              showingServiceRecords={showingServiceRecords}
              showingReports={showingReports}
              onServiceClick={onServiceClick}
              onReportClick={handleReportClick}
            />
            
            <VehicleSummaryInfo vehicle={vehicle} />
            
            <div className="pt-4 border-t border-border/50">
              {!showingServiceRecords && !showingReports ? (
                <VehicleDeviceSection 
                  devices={selectedVehicleDevices}
                  allVehicles={vehicles}
                  onAddDevice={onAddDevice}
                  onEditDevice={onEditDevice}
                  onDeleteDevice={onDeleteDevice}
                  onViewDevice={onViewDevice}
                  onOpenAttachment={handleAttachmentOpen}
                  selectedVehicleId={selectedVehicleId}
                  onMoveDevice={onMoveDevice}
                />
              ) : showingServiceRecords && !showingReports ? (
                <VehicleServiceSection 
                  services={selectedVehicleServices}
                  devices={selectedVehicleDevices}
                  onAddService={onAddService}
                  onEditService={onEditService}
                  onDeleteService={onDeleteService}
                  onViewService={onViewService}
                  onOpenAttachment={handleAttachmentOpen}
                />
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      {reportFormOpen && (
        <VehicleReportForm 
          open={reportFormOpen}
          onClose={() => {
            setReportFormOpen(false);
            setShowingReports(false);
          }}
          vehicle={vehicle}
          devices={selectedVehicleDevices}
          services={selectedVehicleServices}
        />
      )}
    </>
  );
};

export default VehicleDetailPanel;
