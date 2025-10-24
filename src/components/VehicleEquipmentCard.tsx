import React from 'react';
import { VehicleEquipment } from '../utils/types';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, MoreHorizontal, Box, MoveRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
            className="h-16 w-16 rounded object-cover border border-border/50"
            onError={handleImageError}
          />
        ) : (
          <div className="h-16 w-16 rounded bg-muted/30 flex items-center justify-center border border-border/50">
            <Box className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm mb-1">{vehicleEquipment.name}</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {vehicleEquipment.brand && (
              <div>
                <span className="font-medium">Marka:</span> {vehicleEquipment.brand}
              </div>
            )}
            {vehicleEquipment.type && (
              <div>
                <span className="font-medium">Typ:</span> {vehicleEquipment.type}
              </div>
            )}
            {vehicleEquipment.serialNumber && (
              <div>
                <span className="font-medium">Nr seryjny:</span> {vehicleEquipment.serialNumber}
              </div>
            )}
            {vehicleEquipment.year && (
              <div>
                <span className="font-medium">Rok:</span> {vehicleEquipment.year}
              </div>
            )}
          </div>
          {vehicleEquipment.notes && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{vehicleEquipment.notes}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`px-2 py-1 rounded text-xs font-medium border ${status.className}`}>
            {status.label}
          </div>
          
          {actions || (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onViewDetails && (
                  <DropdownMenuItem onClick={() => onViewDetails(vehicleEquipment)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Podgląd
                  </DropdownMenuItem>
                )}
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(vehicleEquipment)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edytuj
                  </DropdownMenuItem>
                )}
                {onMove && (
                  <DropdownMenuItem onClick={() => onMove(vehicleEquipment)}>
                    <MoveRight className="mr-2 h-4 w-4" />
                    Przenieś
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(vehicleEquipment)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Usuń
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleEquipmentCard;
