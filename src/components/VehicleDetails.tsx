
import { useState } from 'react';
import { Vehicle } from '../utils/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FullscreenViewer from './FullscreenViewer';
import VehicleBasicInfo from './vehicle-details/VehicleBasicInfo';
import VehicleServiceInfo from './vehicle-details/VehicleServiceInfo';
import FileAttachments from './FileAttachments';
import { serviceRecords } from '../utils/data/serviceData';
import { devices } from '../utils/data/deviceData';

interface VehicleDetailsProps {
  vehicle: Vehicle;
}

const VehicleDetails = ({ vehicle }: VehicleDetailsProps) => {
  const [fullscreenUrl, setFullscreenUrl] = useState<string | null>(null);

  // Get service records for this vehicle
  const vehicleServices = serviceRecords.filter(record => record.vehicleId === vehicle.id);
  
  // Get devices for this vehicle
  const vehicleDevices = devices.filter(device => device.vehicleId === vehicle.id);

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

  const hasAttachmentsOrImages = (
    (vehicle.attachments && vehicle.attachments.length > 0) || 
    (vehicle.images && vehicle.images.length > 0)
  );

  return (
    <div className="pt-2">
      {fullscreenUrl && (
        <FullscreenViewer
          url={fullscreenUrl}
          onClose={closeFullscreen}
        />
      )}

      <Tabs defaultValue="general">
        <TabsList className="w-full bg-[#ebe9e6] p-1">
          <TabsTrigger value="general" className="flex-1 rounded-md data-[state=active]:shadow-sm">Informacje ogólne</TabsTrigger>
          <TabsTrigger value="service" className="flex-1 rounded-md data-[state=active]:shadow-sm">Serwis i przeglądy</TabsTrigger>
          {hasAttachmentsOrImages && (
            <TabsTrigger value="files" className="flex-1 rounded-md data-[state=active]:shadow-sm">Dokumenty i zdjęcia</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="general" className="pt-4 animate-in fade-in-50 slide-in-from-bottom-3 bg-white rounded-b-lg">
          <VehicleBasicInfo vehicle={vehicle} />
        </TabsContent>

        <TabsContent value="service" className="space-y-6 pt-4 animate-in fade-in-50 slide-in-from-bottom-3 bg-white rounded-b-lg">
          <VehicleServiceInfo 
            vehicle={vehicle} 
            services={vehicleServices}
            devices={vehicleDevices}
            onOpenAttachment={openFullscreen}
          />
        </TabsContent>

        {hasAttachmentsOrImages && (
          <TabsContent value="files" className="pt-4 animate-in fade-in-50 slide-in-from-bottom-3 bg-white rounded-b-lg">
            <FileAttachments 
              attachments={vehicle.attachments} 
              images={vehicle.images}
              itemName={vehicle.name}
              onOpenFullscreen={openFullscreen}
              onOpenInNewTab={openInNewTab}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default VehicleDetails;
