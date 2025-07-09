import React from 'react';
import { Equipment } from '../utils/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Wrench, Calendar, MapPin, FileText, Image as ImageIcon } from 'lucide-react';
import { formatDate } from '../utils/formatting/dateUtils';

interface EquipmentCardProps {
  equipment: Equipment;
  delay?: number;
  actions?: React.ReactNode;
  onAttachmentClick?: (url: string) => void;
}

const EquipmentCard = ({ equipment, delay = 0, actions, onAttachmentClick }: EquipmentCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok': return 'bg-green-100 text-green-800 border-green-200';
      case 'needs-service': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-service': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ok': return 'Sprawne';
      case 'needs-service': return 'Wymaga serwisu';
      case 'in-service': return 'W serwisie';
      case 'error': return 'Błąd';
      default: return 'Nieznany';
    }
  };

  const handleAttachmentClick = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onAttachmentClick?.(url);
  };

  return (
    <Card 
      className={`w-full border border-border/50 shadow-sm hover:shadow-md transition-all duration-200 bg-white/80 backdrop-blur-sm animate-in fade-in-50 slide-in-from-left-5`}
      style={{ animationDelay: `${delay * 100}ms` }}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Wrench className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground truncate">{equipment.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{equipment.brand}</span>
                  {equipment.model && (
                    <>
                      <span>•</span>
                      <span>{equipment.model}</span>
                    </>
                  )}
                  {equipment.type && (
                    <>
                      <span>•</span>
                      <span>{equipment.type}</span>
                    </>
                  )}
                </div>
              </div>
              <Badge className={getStatusColor(equipment.status)}>
                {getStatusText(equipment.status)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              {equipment.serialNumber && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Nr seryjny:</span>
                  <span className="text-muted-foreground">{equipment.serialNumber}</span>
                </div>
              )}
              
              {equipment.year && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Rok: {equipment.year}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Następny serwis: {formatDate(equipment.nextService)}
                </span>
              </div>
            </div>

            {equipment.notes && (
              <div className="mt-3 p-2 bg-muted/50 rounded-md">
                <p className="text-sm text-muted-foreground">{equipment.notes}</p>
              </div>
            )}

            {(equipment.images?.length || equipment.attachments?.length) && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                {equipment.images?.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ImageIcon className="h-3 w-3" />
                    <span>{equipment.images.length} zdjęć</span>
                  </div>
                )}
                {equipment.attachments?.length > 0 && (
                  <div className="flex items-center gap-1">
                    {equipment.attachments.map((attachment, index) => (
                      <button
                        key={index}
                        onClick={(e) => handleAttachmentClick(attachment.url, e)}
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                      >
                        <FileText className="h-3 w-3" />
                        <span>{attachment.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {actions && (
            <div className="flex items-center gap-1 ml-4">
              {actions}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentCard;