
import { Car, Check, Clock, AlertTriangle, Edit, Trash2, Eye } from 'lucide-react';
import { Vehicle } from '../utils/types';
import { formatDate } from '../utils/data';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface VehicleCardProps {
  vehicle: Vehicle;
  delay?: number;
  onEdit: () => void;
  onDelete: () => void;
  isSelected?: boolean;
  onClick: () => void;
  compact?: boolean;
  onView?: () => void;
}

const VehicleCard = ({ 
  vehicle, 
  delay = 0, 
  onEdit,
  onDelete,
  isSelected = false,
  onClick,
  compact = false,
  onView
}: VehicleCardProps) => {
  const delayClass = `staggered-delay-${delay}`;
  
  const getStatusIcon = () => {
    switch (vehicle.status) {
      case 'ok':
        return <div className="h-5 w-5 rounded-full bg-green-100/70 flex items-center justify-center text-green-600"><Check className="h-3 w-3" /></div>;
      case 'needs-service':
        return <div className="h-5 w-5 rounded-full bg-orange-100/70 flex items-center justify-center text-orange-600"><Clock className="h-3 w-3" /></div>;
      case 'in-service':
        return <div className="h-5 w-5 rounded-full bg-blue-100/70 flex items-center justify-center text-blue-600"><Car className="h-3 w-3" /></div>;
      default:
        return <div className="h-5 w-5 rounded-full bg-red-100/70 flex items-center justify-center text-red-600"><AlertTriangle className="h-3 w-3" /></div>;
    }
  };

  const getStatusText = () => {
    switch (vehicle.status) {
      case 'ok':
        return "Sprawny";
      case 'needs-service':
        return "Wymaga serwisu";
      case 'in-service':
        return "W serwisie";
      default:
        return "Problem";
    }
  };
  
  const getCardClass = () => {
    const baseClass = vehicle.status === 'ok' ? 'gradient-card-green border-green-400/30' : 
                     vehicle.status === 'needs-service' ? 'gradient-card-orange border-orange-400/30' : 
                     vehicle.status === 'in-service' ? 'gradient-card-blue border-blue-400/30' : 
                     'gradient-card-red border-red-400/30';
    
    return `${baseClass} ${isSelected ? 'ring-2 ring-primary shadow-lg' : ''}`;
  };
  
  const safeFormatDate = (dateValue: any) => {
    if (!dateValue) return 'Brak danych';
    
    try {
      if (dateValue instanceof Date) {
        return formatDate(dateValue);
      }
      
      return formatDate(new Date(dateValue));
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Nieprawidłowa data';
    }
  };
  
  const nextServiceFormatted = vehicle.serviceExpiryDate 
    ? safeFormatDate(vehicle.serviceExpiryDate) 
    : safeFormatDate(vehicle.nextService);
  
  return (
    <div 
      className={`rounded-lg p-3 opacity-0 animate-fade-in ${delayClass} hover:shadow-elevated transition-all ${getCardClass()} backdrop-blur-card cursor-pointer w-full h-[140px] overflow-hidden`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center gap-4 w-full">
          {vehicle.thumbnail ? (
            <div className="h-[100px] w-[100px] rounded-md overflow-hidden flex-shrink-0 bg-background/50 flex items-center justify-center">
              <img 
                src={vehicle.thumbnail} 
                alt={vehicle.name} 
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-[100px] w-[100px] rounded-md overflow-hidden flex-shrink-0 bg-background/50 flex items-center justify-center">
              <Car className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          <div className="flex flex-col justify-center h-full flex-grow truncate">
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold truncate">{vehicle.name}</h3>
              <p className="text-base text-muted-foreground truncate">{vehicle.brand || ''} • {vehicle.registrationNumber}</p>
              <div className="flex items-center whitespace-nowrap text-base text-muted-foreground mt-2">
                <span className="truncate">Następny serwis: {nextServiceFormatted}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div className="flex gap-2">
            {onView && (
              <Button 
                className="h-10 w-10 p-0" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onView();
                }}
                variant="outline"
              >
                <Eye className="h-5 w-5" />
              </Button>
            )}
            
            <Button 
              className="h-10 w-10 p-0" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              variant="secondary"
            >
              <Edit className="h-5 w-5" />
            </Button>
            
            <Button 
              className="h-10 w-10 p-0" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              variant="destructive"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
