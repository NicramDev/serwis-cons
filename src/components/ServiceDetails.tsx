
import { useState } from 'react';
import { ServiceRecord } from '../utils/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FullscreenViewer from './FullscreenViewer';
import { formatDate } from '../utils/data';
import FileAttachments from './FileAttachments';

interface ServiceDetailsProps {
  service: ServiceRecord;
}

const ServiceDetails = ({ service }: ServiceDetailsProps) => {
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

  return (
    <div className="pt-2">
      {fullscreenUrl && (
        <FullscreenViewer
          url={fullscreenUrl}
          onClose={closeFullscreen}
        />
      )}

      <Tabs defaultValue="general">
        <TabsList className="w-full bg-secondary/50 p-1">
          <TabsTrigger value="general" className="flex-1 rounded-md data-[state=active]:shadow-sm">Informacje ogólne</TabsTrigger>
          {hasAttachmentsOrImages && (
            <TabsTrigger value="files" className="flex-1 rounded-md data-[state=active]:shadow-sm">Dokumenty i zdjęcia</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="general" className="pt-4 animate-in fade-in-50 slide-in-from-bottom-3">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                {service.type === 'repair' ? 'Naprawa' : 
                 service.type === 'maintenance' ? 'Konserwacja' : 
                 'Przegląd'}
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
                <p className="font-medium">{service.deviceName || 'Pojazd'}</p>
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
          <TabsContent value="files" className="pt-4 animate-in fade-in-50 slide-in-from-bottom-3">
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
