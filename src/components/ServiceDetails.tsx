
import { useState } from 'react';
import { ServiceRecord } from '../utils/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FullscreenViewer from './FullscreenViewer';
import { formatDate } from '../utils/data';
import { FileText, FileImage, ExternalLink, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
            <div className="space-y-6">
              {service.attachments && service.attachments.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground/80">Załączniki</h3>
                  <div className="space-y-3">
                    {service.attachments.map((file, idx) => (
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
              
              {service.images && service.images.length > 0 && (
                <div className={service.attachments && service.attachments.length > 0 ? "mt-6" : ""}>
                  <h3 className="text-lg font-semibold mb-3 text-foreground/80">Zdjęcia</h3>
                  <div className="space-y-3">
                    {service.images.map((imgUrl, idx) => (
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
                              alt={`Zdjęcie serwisowe ${idx + 1}`}
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

export default ServiceDetails;
