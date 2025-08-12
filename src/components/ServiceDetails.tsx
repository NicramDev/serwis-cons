
import { useState } from 'react';
import { ServiceRecord, Device } from '../utils/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FullscreenViewer from './FullscreenViewer';
import { formatDate } from '../utils/formatting/dateUtils';
import FileAttachments from './FileAttachments';
import { Smartphone } from 'lucide-react';

interface ServiceDetailsProps {
  service: ServiceRecord;
  device?: Device | null;
}

const ServiceDetails = ({ service, device }: ServiceDetailsProps) => {
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
    (service.attachments && service.attachments.length > 0) || 
    (service.images && service.images.length > 0)
  );
  
  const getServiceTypeText = (type: string) => {
    switch (type) {
      case 'repair':
        return 'Naprawa';
      case 'maintenance':
        return 'Serwis';
      case 'inspection':
        return 'Przegląd';
      case 'replacement':
        return 'Wymiana';
      default:
        return 'Inne';
    }
  };

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
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                {getServiceTypeText(service.type)}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
                <p className="text-sm text-muted-foreground">Data</p>
                <p className="font-medium">{formatDate(service.date)}</p>
              </div>
              <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
                <p className="text-sm text-muted-foreground">Technik</p>
                <p className="font-medium">{service.technician}</p>
              </div>
              <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
                <p className="text-sm text-muted-foreground">Koszt</p>
                <p className="font-medium">{service.cost.toFixed(2)} PLN</p>
              </div>
              <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
                <p className="text-sm text-muted-foreground">Dotyczy</p>
                {service.deviceName && device?.thumbnail ? (
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-md overflow-hidden bg-background/50 flex-shrink-0 flex items-center justify-center border border-border/30">
                      <img 
                        src={device.thumbnail} 
                        alt={service.deviceName}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <p className="font-medium">{service.deviceName}</p>
                  </div>
                ) : service.deviceName ? (
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-md overflow-hidden bg-background/50 flex-shrink-0 flex items-center justify-center border border-border/30">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="font-medium">{service.deviceName}</p>
                  </div>
                ) : (
                  <p className="font-medium">Pojazd</p>
                )}
              </div>
            </div>
            
            <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
              <p className="text-sm text-muted-foreground">Opis</p>
              <p className="font-medium whitespace-pre-wrap">{service.description}</p>
            </div>
            
            {service.notes && (
              <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
                <p className="text-sm text-muted-foreground">Dodatkowe uwagi</p>
                <p className="font-medium whitespace-pre-wrap">{service.notes}</p>
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
              attachments={service.attachments} 
              images={service.images}
              onOpenFullscreen={openFullscreen}
              onOpenInNewTab={openInNewTab}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ServiceDetails;
