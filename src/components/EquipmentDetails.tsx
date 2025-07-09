import { useState } from 'react';
import { Equipment } from '../utils/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FullscreenViewer from './FullscreenViewer';
import { formatDate } from '../utils/formatting/dateUtils';
import FileAttachments from './FileAttachments';

interface EquipmentDetailsProps {
  equipment: Equipment;
}

const EquipmentDetails = ({ equipment }: EquipmentDetailsProps) => {
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
    (equipment.attachments && equipment.attachments.length > 0) || 
    (equipment.images && equipment.images.length > 0)
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
                <p className="font-medium">{equipment.name}</p>
              </div>
              <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
                <p className="text-sm text-muted-foreground">Typ</p>
                <p className="font-medium">{equipment.type}</p>
              </div>
              <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
                <p className="text-sm text-muted-foreground">Marka</p>
                <p className="font-medium">{equipment.brand || '-'}</p>
              </div>
              <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
                <p className="text-sm text-muted-foreground">Model</p>
                <p className="font-medium">{equipment.model || '-'}</p>
              </div>
              <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
                <p className="text-sm text-muted-foreground">Numer seryjny</p>
                <p className="font-medium">{equipment.serialNumber}</p>
              </div>
              <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
                <p className="text-sm text-muted-foreground">Rok produkcji</p>
                <p className="font-medium">{equipment.year || '-'}</p>
              </div>
            </div>
            
            {equipment.purchaseDate && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
                  <p className="text-sm text-muted-foreground">Data zakupu</p>
                  <p className="font-medium">{formatDate(equipment.purchaseDate)}</p>
                </div>
                {equipment.purchasePrice && (
                  <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
                    <p className="text-sm text-muted-foreground">Cena zakupu</p>
                    <p className="font-medium">{equipment.purchasePrice} PLN</p>
                  </div>
                )}
              </div>
            )}
            
            {equipment.notes && (
              <div className="space-y-1 p-3 rounded-lg bg-secondary/50 backdrop-blur-sm shadow-sm border border-border/50">
                <p className="text-sm text-muted-foreground">Opis</p>
                <p className="font-medium whitespace-pre-wrap">{equipment.notes}</p>
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
              attachments={equipment.attachments} 
              images={equipment.images}
              itemName={equipment.name}
              onOpenFullscreen={openFullscreen}
              onOpenInNewTab={openInNewTab}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default EquipmentDetails;