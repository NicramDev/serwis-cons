
import { useState } from 'react';
import { Device } from '../utils/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FullscreenViewer from './FullscreenViewer';
import { formatDate } from '../utils/data';
import FileAttachments from './FileAttachments';

interface DeviceDetailsProps {
  device: Device;
}

const DeviceDetails = ({ device }: DeviceDetailsProps) => {
  const [fullscreenUrl, setFullscreenUrl] = useState<string | null>(null);

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
    (device.attachments && device.attachments.length > 0) || 
    (device.images && device.images.length > 0)
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
          {hasAttachmentsOrImages && (
            <TabsTrigger value="files" className="flex-1 rounded-md data-[state=active]:shadow-sm">Dokumenty i zdjęcia</TabsTrigger>
          )}
        </TabsList>

        <TabsContent 
          value="general" 
          className="pt-4 animate-in fade-in-50 slide-in-from-bottom-3 p-4 bg-white rounded-b-lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
                <p className="text-sm text-muted-foreground">Nazwa</p>
                <p className="font-medium">{device.name}</p>
              </div>
              <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
                <p className="text-sm text-muted-foreground">Typ</p>
                <p className="font-medium">{device.type}</p>
              </div>
              <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
                <p className="text-sm text-muted-foreground">Model</p>
                <p className="font-medium">{device.model || '-'}</p>
              </div>
              <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
                <p className="text-sm text-muted-foreground">Numer seryjny</p>
                <p className="font-medium">{device.serialNumber}</p>
              </div>
              <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
                <p className="text-sm text-muted-foreground">Rok produkcji</p>
                <p className="font-medium">{device.year || '-'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
                <p className="text-sm text-muted-foreground">Ostatni serwis</p>
                <p className="font-medium">{formatDate(device.lastService)}</p>
              </div>
              <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
                <p className="text-sm text-muted-foreground">Następny serwis</p>
                <p className="font-medium">{formatDate(device.nextService)}</p>
              </div>
              {device.serviceExpiryDate && (
                <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
                  <p className="text-sm text-muted-foreground">Serwis ważny do</p>
                  <p className="font-medium">{formatDate(device.serviceExpiryDate)}</p>
                </div>
              )}
              {device.serviceReminderDays && (
                <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
                  <p className="text-sm text-muted-foreground">Dni przypomnienia</p>
                  <p className="font-medium">{device.serviceReminderDays} dni</p>
                </div>
              )}
            </div>
            
            {device.notes && (
              <div className="space-y-1 p-3 rounded-lg bg-secondary/50 backdrop-blur-sm shadow-sm border border-border/50">
                <p className="text-sm text-muted-foreground">Opis</p>
                <p className="font-medium whitespace-pre-wrap">{device.notes}</p>
              </div>
            )}
          </div>
        </TabsContent>

        {hasAttachmentsOrImages && (
          <TabsContent 
            value="files" 
            className="pt-4 animate-in fade-in-50 slide-in-from-bottom-3 p-4 bg-white rounded-b-lg"
          >
            <FileAttachments 
              attachments={device.attachments} 
              images={device.images}
              itemName={device.name}
              onOpenFullscreen={openFullscreen}
              onOpenInNewTab={openInNewTab}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default DeviceDetails;

