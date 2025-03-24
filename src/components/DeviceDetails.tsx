import { useState } from 'react';
import { Device } from '../utils/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FullscreenViewer from './FullscreenViewer';
import { formatDate } from '../utils/data';
import { Badge } from '@/components/ui/badge';
import { FileText, FileImage, ExternalLink, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        <TabsList className="w-full bg-secondary/50 p-1">
          <TabsTrigger value="general" className="flex-1 rounded-md data-[state=active]:shadow-sm">Informacje ogólne</TabsTrigger>
          {hasAttachmentsOrImages && (
            <TabsTrigger value="files" className="flex-1 rounded-md data-[state=active]:shadow-sm">Dokumenty i zdjęcia</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="general" className="pt-4 animate-in fade-in-50 slide-in-from-bottom-3">
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
              <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium">
                  <Badge variant={
                    device.status === 'ok' ? 'outline' :
                    device.status === 'needs-service' ? 'secondary' : 
                    device.status === 'in-service' ? 'default' : 
                    'destructive'
                  }>
                    {device.status === 'ok' ? 'OK' :
                    device.status === 'needs-service' ? 'Wymaga serwisu' : 
                    device.status === 'in-service' ? 'W serwisie' : 
                    'Problem'}
                  </Badge>
                </p>
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
              <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
                <p className="text-sm text-muted-foreground">Opis</p>
                <p className="font-medium whitespace-pre-wrap">{device.notes}</p>
              </div>
            )}
          </div>
        </TabsContent>

        {hasAttachmentsOrImages && (
          <TabsContent value="files" className="pt-4 animate-in fade-in-50 slide-in-from-bottom-3">
            <div className="space-y-6">
              {device.attachments && device.attachments.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground/80">Załączniki</h3>
                  <div className="space-y-3">
                    {device.attachments.map((file, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between bg-white/50 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-border/50 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => openFullscreen(file.url)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {file.type} • {(file.size / 1024).toFixed(0)} KB
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={(e) => openFullscreen(file.url, e)}
                            className="text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 border-none"
                          >
                            <Maximize className="h-4 w-4 mr-1" />
                            Pełny ekran
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => openInNewTab(file.url, e)}
                            className="text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 border-none"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Nowa karta
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {device.images && device.images.length > 0 && (
                <div className={device.attachments && device.attachments.length > 0 ? "mt-6" : ""}>
                  <h3 className="text-lg font-semibold mb-3 text-foreground/80">Zdjęcia</h3>
                  <div className="space-y-3">
                    {device.images.map((imgUrl, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between bg-white/50 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-border/50 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => openFullscreen(imgUrl)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <FileImage className="h-5 w-5" />
                          </div>
                          <div className="flex items-center space-x-3">
                            <img 
                              src={imgUrl} 
                              alt={`${device.name} - zdjęcie ${idx + 1}`}
                              className="h-12 w-16 object-cover rounded-md"
                            />
                            <p className="font-medium">Zdjęcie {idx + 1}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={(e) => openFullscreen(imgUrl, e)}
                            className="text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 border-none"
                          >
                            <Maximize className="h-4 w-4 mr-1" />
                            Pełny ekran
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => openInNewTab(imgUrl, e)}
                            className="text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 border-none"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Nowa karta
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default DeviceDetails;
