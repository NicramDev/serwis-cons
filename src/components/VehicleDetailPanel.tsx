
import React, { useState } from 'react';
import { Vehicle, Device, ServiceRecord } from '../utils/types';
import { formatDate } from '../utils/data';
import { Wrench, Cpu, Edit, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from "@/components/ui/card";
import ServiceRecordList from './ServiceRecordList';
import DeviceList from './DeviceList';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DeviceDetails from './DeviceDetails';
import FullscreenViewer from './FullscreenViewer';

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
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [fullscreenUrl, setFullscreenUrl] = useState<string | null>(null);

  // Function to open attachments in a new tab/window
  const handleAttachmentOpen = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer,fullscreen=yes');
  };

  const openFullscreen = (url: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setFullscreenUrl(url);
  };

  const closeFullscreen = () => {
    setFullscreenUrl(null);
  };

  const openInNewTab = (url: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    window.open(url, '_blank');
  };

  if (!selectedVehicleId) {
    return (
      <div className="h-full flex items-center justify-center p-6 bg-white/50 backdrop-blur-sm border border-border/50 rounded-lg shadow-sm">
        <div className="text-center">
          <div className="icon-container mx-auto mb-4">
            <Wrench className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-medium mb-2">Wybierz pojazd</h3>
          <p className="text-muted-foreground max-w-sm">
            Wybierz pojazd z listy po lewej stronie, aby zobaczyć szczegóły i przypisane urządzenia
          </p>
        </div>
      </div>
    );
  }

  const vehicle = vehicles.find(v => v.id === selectedVehicleId);
  if (!vehicle) return null;

  const selectedVehicleDevices = devices.filter(device => device.vehicleId === selectedVehicleId);
  const selectedDevice = selectedVehicleDevices.find(device => device.id === selectedDeviceId);
  
  if (selectedDeviceId && selectedDevice) {
    return (
      <Card className="w-full border border-border/50 shadow-sm bg-white/80 backdrop-blur-sm animate-in fade-in-50 slide-in-from-right-5">
        <CardContent className="p-6">
          {fullscreenUrl && (
            <FullscreenViewer
              url={fullscreenUrl}
              onClose={closeFullscreen}
            />
          )}
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedDeviceId(null)}
              className="flex items-center gap-1 text-primary"
            >
              &larr; Wróć do listy urządzeń
            </Button>
            <div className="flex gap-2">
              {onEditDevice && (
                <Button 
                  size="sm" 
                  onClick={() => onEditDevice(selectedDevice)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edytuj
                </Button>
              )}
              {onDeleteDevice && (
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => {
                    onDeleteDevice(selectedDevice);
                    setSelectedDeviceId(null);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Usuń
                </Button>
              )}
            </div>
          </div>
          
          <DeviceDetails 
            device={selectedDevice} 
          />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full border border-border/50 shadow-sm bg-white/80 backdrop-blur-sm animate-in fade-in-50 slide-in-from-right-5">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{vehicle.name}</h2>
              <p className="text-muted-foreground">{vehicle.brand || 'Brak marki'}</p>
            </div>
            <div className="flex space-x-2">
              <Tabs 
                defaultValue={showingServiceRecords ? "service" : "devices"} 
                value={showingServiceRecords ? "service" : "devices"}
                className="w-auto"
                onValueChange={(value) => {
                  if ((value === "service" && !showingServiceRecords) || 
                      (value === "devices" && showingServiceRecords)) {
                    onServiceClick();
                  }
                }}
              >
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger 
                    value="service" 
                    className={`flex items-center gap-1 ${showingServiceRecords ? 'bg-primary text-primary-foreground' : ''}`}
                  >
                    <Wrench className="h-4 w-4" />
                    Serwis
                  </TabsTrigger>
                  <TabsTrigger 
                    value="devices" 
                    className={`flex items-center gap-1 ${!showingServiceRecords ? 'bg-primary text-primary-foreground' : ''}`}
                  >
                    <Cpu className="h-4 w-4" />
                    Urządzenia
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
              <p className="text-sm text-muted-foreground">Numer rejestracyjny</p>
              <p className="font-medium">{vehicle.registrationNumber}</p>
            </div>
            <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
              <p className="text-sm text-muted-foreground">Następny serwis</p>
              <p className="font-medium">
                {vehicle.serviceExpiryDate ? 
                  formatDate(vehicle.serviceExpiryDate) : 
                  formatDate(vehicle.nextService)}
              </p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-border/50">
            <div className="flex items-center justify-between mb-3">
              {!showingServiceRecords ? (
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Cpu className="h-4 w-4" />
                  <span>Przypisane urządzenia ({selectedVehicleDevices.length})</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Wrench className="h-4 w-4" />
                  <span>Historia serwisowa ({services.length})</span>
                </div>
              )}
              
              {!showingServiceRecords ? (
                <div>
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
              ) : (
                <div>
                  <Button 
                    size="sm" 
                    onClick={onAddService}
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Dodaj serwis/naprawę
                  </Button>
                </div>
              )}
            </div>
            
            {!showingServiceRecords ? (
              <DeviceList 
                devices={selectedVehicleDevices} 
                onEditDevice={onEditDevice}
                onDeleteDevice={onDeleteDevice}
                onViewDevice={(device) => setSelectedDeviceId(device.id)}
                onOpenAttachment={handleAttachmentOpen}
              />
            ) : (
              <ServiceRecordList 
                services={services} 
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
