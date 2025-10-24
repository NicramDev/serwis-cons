import React, { useState } from 'react';
import { Vehicle, Device, Equipment, ServiceRecord } from '../utils/types';
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
  equipment: Equipment[];
  services: ServiceRecord[];
  showingServiceRecords: boolean;
  onServiceClick: () => void;
  onEdit: (vehicle: Vehicle) => void;
  onAddService: () => void;
  onAddDevice?: () => void;
  onAddEquipment?: () => void;
  onEditDevice?: (device: Device) => void;
  onDeleteDevice?: (device: Device) => void;
  onViewDevice?: (device: Device) => void;
  onEditEquipment?: (equipment: Equipment) => void;
  onDeleteEquipment?: (equipment: Equipment) => void;
  onViewEquipment?: (equipment: Equipment) => void;
  onEditService?: (service: ServiceRecord) => void;
  onDeleteService?: (service: ServiceRecord) => void;
  onViewService?: (service: ServiceRecord) => void;
  onSaveService?: () => void;
  onView?: (vehicle: Vehicle) => void;
  onMoveDevice?: (device: Device, targetVehicleId: string) => void;
  onMoveEquipment?: (equipment: Equipment, targetVehicleId: string) => void;
  onConvertToEquipment?: (device: Device) => void;
}

const VehicleDetailPanel = ({
  selectedVehicleId,
  vehicles,
  devices,
  equipment,
  services,
  showingServiceRecords,
  onServiceClick,
  onEdit,
  onAddService,
  onAddDevice,
  onAddEquipment,
  onEditDevice,
  onDeleteDevice,
  onViewDevice,
  onEditEquipment,
  onDeleteEquipment,
  onViewEquipment,
  onEditService,
  onDeleteService,
  onViewService,
  onSaveService,
  onView,
  onMoveDevice,
  onMoveEquipment,
  onConvertToEquipment
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
  // Only show equipment assigned to the selected vehicle
  const selectedVehicleEquipment = equipment.filter(item => item.vehicleId === selectedVehicleId);
  const selectedVehicleServices = services.filter(service => service.vehicleId === selectedVehicleId);

  console.info('[VehicleDetailPanel] vehicleId:', selectedVehicleId, {
    devicesAll: devices.length,
    equipmentAll: equipment.length,
    servicesAll: services.length,
    devicesForVehicle: selectedVehicleDevices.length,
    equipmentForVehicle: selectedVehicleEquipment.length,
    servicesForVehicle: selectedVehicleServices.length,
  });
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
                  equipment={selectedVehicleEquipment}
                  allVehicles={vehicles}
                  onAddDevice={onAddDevice}
                  onAddEquipment={onAddEquipment}
                  onEditDevice={onEditDevice}
                  onDeleteDevice={onDeleteDevice}
                  onViewDevice={onViewDevice}
                  onEditEquipment={onEditEquipment}
                  onDeleteEquipment={onDeleteEquipment}
                  onViewEquipment={onViewEquipment}
                  onOpenAttachment={handleAttachmentOpen}
                  selectedVehicleId={selectedVehicleId}
                  onMoveDevice={onMoveDevice}
                  onMoveEquipment={onMoveEquipment}
                  onConvertToEquipment={onConvertToEquipment}
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
          equipment={selectedVehicleEquipment}
          services={selectedVehicleServices}
        />
      )}
    </>
  );
};

export default VehicleDetailPanel;
