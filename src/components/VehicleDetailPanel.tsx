import React, { useState, useEffect } from 'react';
import { Vehicle, Device, ServiceRecord, VehicleEquipment } from '../utils/types';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { mapSupabaseEquipmentToEquipment, mapSupabaseVehicleEquipmentToVehicleEquipment } from '@/utils/supabaseMappers';
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
  vehicleEquipment?: VehicleEquipment[];
  services: ServiceRecord[];
  showingServiceRecords: boolean;
  onServiceClick: () => void;
  onEdit: (vehicle: Vehicle) => void;
  onAddService: () => void;
  onAddDevice?: () => void;
  onAddVehicleEquipment?: () => void;
  onEditDevice?: (device: Device) => void;
  onDeleteDevice?: (device: Device) => void;
  onViewDevice?: (device: Device) => void;
  onEditVehicleEquipment?: (ve: VehicleEquipment) => void;
  onDeleteVehicleEquipment?: (ve: VehicleEquipment) => void;
  onViewVehicleEquipment?: (ve: VehicleEquipment) => void;
  onMoveVehicleEquipment?: (ve: VehicleEquipment) => void;
  onEditService?: (service: ServiceRecord) => void;
  onDeleteService?: (service: ServiceRecord) => void;
  onViewService?: (service: ServiceRecord) => void;
  onSaveService?: () => void;
  onView?: (vehicle: Vehicle) => void;
  onMoveDevice?: (device: Device, targetVehicleId: string) => void;
  onConvertToEquipment?: (device: Device) => void;
}

const VehicleDetailPanel = ({
  selectedVehicleId,
  vehicles,
  devices,
  vehicleEquipment = [],
  services,
  showingServiceRecords,
  onServiceClick,
  onEdit,
  onAddService,
  onAddDevice,
  onAddVehicleEquipment,
  onEditDevice,
  onDeleteDevice,
  onViewDevice,
  onEditVehicleEquipment,
  onDeleteVehicleEquipment,
  onViewVehicleEquipment,
  onMoveVehicleEquipment,
  onEditService,
  onDeleteService,
  onViewService,
  onSaveService,
  onView,
  onMoveDevice,
  onConvertToEquipment
}: VehicleDetailPanelProps) => {
  const [showingReports, setShowingReports] = useState(false);
  const [reportFormOpen, setReportFormOpen] = useState(false);
  const [selectedVehicleEquipmentForReport, setSelectedVehicleEquipmentForReport] = useState<VehicleEquipment[]>([]);

  // Pobierz vehicle equipment dla wybranego pojazdu (dla zestawień)
  useEffect(() => {
    if (!selectedVehicleId) {
      setSelectedVehicleEquipmentForReport([]);
      return;
    }

    const fetchVehicleEquipment = async () => {
      console.log('[VehicleDetailPanel] Fetching vehicle equipment for vehicle:', selectedVehicleId);
      const { data, error } = await supabase
        .from('vehicle_equipment')
        .select('*')
        .eq('vehicleid', selectedVehicleId);
      
      console.log('[VehicleDetailPanel] Raw data from DB:', data, 'Error:', error);
      
      if (error) {
        console.error('Error fetching vehicle equipment:', error);
        setSelectedVehicleEquipmentForReport([]);
      } else if (data) {
        console.log('[VehicleDetailPanel] Data before mapping:', data.length, 'items');
        const mapped = data.map(mapSupabaseVehicleEquipmentToVehicleEquipment);
        console.log('[VehicleDetailPanel] Data after mapping:', mapped.length, 'items', mapped);
        setSelectedVehicleEquipmentForReport(mapped);
        console.info('[VehicleDetailPanel] Vehicle equipment loaded for vehicle:', selectedVehicleId, mapped.length);
      } else {
        console.warn('[VehicleDetailPanel] No data returned for vehicle equipment');
        setSelectedVehicleEquipmentForReport([]);
      }
    };

    fetchVehicleEquipment();

    // Realtime subscription
    const channel = supabase
      .channel(`vehicle-equipment-${selectedVehicleId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'vehicle_equipment',
          filter: `vehicleid=eq.${selectedVehicleId}`
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const mapped = mapSupabaseVehicleEquipmentToVehicleEquipment(payload.new);
            setSelectedVehicleEquipmentForReport((prev) => {
              const exists = prev.some(e => e.id === mapped.id);
              return exists ? prev.map(e => e.id === mapped.id ? mapped : e) : [...prev, mapped];
            });
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old?.id as string;
            setSelectedVehicleEquipmentForReport((prev) => prev.filter((e) => e.id !== deletedId));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedVehicleId]);

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
      <ScrollArea className="h-[calc(100vh-280px)]">
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
                  vehicleEquipment={vehicleEquipment}
                  allVehicles={vehicles}
                  onAddDevice={onAddDevice}
                  onAddVehicleEquipment={onAddVehicleEquipment}
                  onEditDevice={onEditDevice}
                  onDeleteDevice={onDeleteDevice}
                  onViewDevice={onViewDevice}
                  onEditVehicleEquipment={onEditVehicleEquipment}
                  onDeleteVehicleEquipment={onDeleteVehicleEquipment}
                  onViewVehicleEquipment={onViewVehicleEquipment}
                  onMoveVehicleEquipment={onMoveVehicleEquipment}
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
      </ScrollArea>

      {reportFormOpen && (
        <VehicleReportForm 
          open={reportFormOpen}
          onClose={() => {
            setReportFormOpen(false);
            setShowingReports(false);
          }}
          vehicle={vehicle}
          devices={selectedVehicleDevices}
          vehicleEquipment={selectedVehicleEquipmentForReport}
          services={selectedVehicleServices}
        />
      )}
    </>
  );
};

export default VehicleDetailPanel;
