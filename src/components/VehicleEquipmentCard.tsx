import React from 'react';
import { VehicleEquipment } from '../utils/types';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, Box, MoveRight } from 'lucide-react';

interface VehicleEquipmentCardProps {
  vehicleEquipment: VehicleEquipment;
  onEdit?: (ve: VehicleEquipment) => void;
  onDelete?: (ve: VehicleEquipment) => void;
  onViewDetails?: (ve: VehicleEquipment) => void;
  onAttachmentClick?: (url: string) => void;
  onMove?: (ve: VehicleEquipment) => void;
  delay?: number;
  actions?: React.ReactNode;
}

const VehicleEquipmentCard = ({
  vehicleEquipment,
  onEdit,
  onDelete,
  onViewDetails,
  onAttachmentClick,
  onMove,
  delay = 0,
  actions
}: VehicleEquipmentCardProps) => {
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const statusConfig = {
    ok: { label: 'OK', className: 'bg-green-100 text-green-800 border-green-200' },
    'needs-service': { label: 'Wymaga serwisu', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    'in-service': { label: 'W serwisie', className: 'bg-blue-100 text-blue-800 border-blue-200' },
    error: { label: 'Błąd', className: 'bg-red-100 text-red-800 border-red-200' }
  };

  const status = statusConfig[vehicleEquipment.status] || statusConfig.ok;

  return (
    <div 
      className="p-4 border border-border/50 rounded-lg bg-white/50 hover:bg-white/80 transition-all duration-200 animate-in fade-in-50 slide-in-from-bottom-3"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-4">
        {vehicleEquipment.thumbnail && !imageError ? (
          <img 
            src={vehicleEquipment.thumbnail} 
            alt={vehicleEquipment.name}
            className="h-[75px] w-[75px] rounded object-cover border border-border/50"
            onError={handleImageError}
          />
        ) : (
          <div className="h-[75px] w-[75px] rounded bg-muted/30 flex items-center justify-center border border-border/50">
            <Box className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm mb-2">{vehicleEquipment.name}</h4>
          <div className="space-y-1 text-xs">
            <div className="grid grid-cols-2 gap-x-4">
              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground">Marka, Typ:</span>
                <span className="text-black dark:text-white">{vehicleEquipment.brand || '-'}, {vehicleEquipment.type || '-'}</span>
              </div>
              {vehicleEquipment.nextService && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-muted-foreground">Wymagany serwis:</span>
                  <span className="text-black dark:text-white">{new Date(vehicleEquipment.nextService).toLocaleDateString('pl-PL')}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-muted-foreground">Ilość:</span>
              <span className="text-black dark:text-white">{vehicleEquipment.quantity || '-'}</span>
            </div>
          </div>
        </div>
        
        <div className={`px-2 py-1 rounded text-xs font-medium border ${status.className}`}>
          {status.label}
        </div>
      </div>
      
      <div className="mt-3">
        {actions ? (
          actions
        ) : (
          <div className="grid grid-cols-4 gap-1">
            {onViewDetails && (
              <Button 
                variant="secondary"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => onViewDetails(vehicleEquipment)}
              >
                <Eye className="h-3 w-3 mr-1" />
                Podgląd
              </Button>
            )}
            {onEdit && (
              <Button 
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => onEdit(vehicleEquipment)}
              >
                <Edit className="h-3 w-3 mr-1" />
                Edycja
              </Button>
            )}
            {onMove && (
              <Button 
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => onMove(vehicleEquipment)}
              >
                <MoveRight className="h-3 w-3 mr-1" />
                Przenieś
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="destructive"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => onDelete(vehicleEquipment)}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Usuń
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleEquipmentCard;
