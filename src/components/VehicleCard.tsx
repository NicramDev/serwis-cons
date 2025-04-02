
import { Car, Check, Clock, AlertTriangle, Edit, Trash2, Eye } from 'lucide-react';
import { Vehicle } from '../utils/types';
import { formatDate } from '../utils/data';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

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
      className={`rounded-lg p-3 opacity-0 animate-fade-in ${delayClass} hover:shadow-elevated transition-all ${getCardClass()} backdrop-blur-card cursor-pointer w-full h-auto`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4 w-full">
          {vehicle.thumbnail ? (
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="h-[88px] w-40 rounded-md overflow-hidden flex-shrink-0 bg-background/50 flex items-center justify-center cursor-zoom-in">
                  <img 
                    src={vehicle.thumbnail} 
                    alt={vehicle.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-auto p-0">
                <div className="h-[176px] w-80 overflow-hidden">
                  <img 
                    src={vehicle.thumbnail} 
                    alt={vehicle.name} 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
              </HoverCardContent>
            </HoverCard>
          ) : (
            <div className="h-[88px] w-40 rounded-md overflow-hidden flex-shrink-0 bg-background/50 flex items-center justify-center">
              <Car className="h-14 w-14 text-muted-foreground" />
            </div>
          )}
          <div className="flex flex-col justify-between h-[88px] flex-grow">
            <div>
              <h3 className="text-xs font-semibold">{vehicle.name}</h3>
              <p className="text-xs text-muted-foreground">{vehicle.brand || ''} • {vehicle.registrationNumber}</p>
              <div className="flex items-center whitespace-nowrap text-xs text-muted-foreground mt-1">
                <span>Następny serwis: {nextServiceFormatted}</span>
              </div>
            </div>
          </div>
        </div>
        {getStatusIcon()}
      </div>
      
      <div className="flex justify-end items-center mt-2">
        <div className="flex gap-1">
          {onView && (
            <Button 
              className="h-6 w-6 p-0" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
              variant="outline"
            >
              <Eye className="h-3 w-3" />
            </Button>
          )}
          
          <Button 
            className="h-6 w-6 p-0" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            variant="secondary"
          >
            <Edit className="h-3 w-3" />
          </Button>
          
          <Button 
            className="h-6 w-6 p-0" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            variant="destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
