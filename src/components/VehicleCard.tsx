
import React from 'react';
import { Car, Check, Clock, AlertTriangle, Edit, Trash2, Eye } from 'lucide-react';
import { Vehicle } from '../utils/types';
import { formatDate } from '../utils/formatting/dateUtils';
import { Button } from './ui/button';

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
    
    return `${baseClass} ${isSelected 
      ? 'bg-red-500 border-2 border-red-600' 
      : 'hover:bg-blue-50/30'}`;
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
      className={`rounded-lg p-2 sm:p-3 opacity-0 animate-fade-in ${delayClass} hover:shadow-elevated transition-all ${getCardClass()} backdrop-blur-card cursor-pointer w-full h-auto min-w-0 max-w-full`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between min-w-0 max-w-full">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 w-full min-w-0 max-w-full">
          {vehicle.thumbnail ? (
            <div className="h-16 w-20 sm:h-20 sm:w-28 md:h-[88px] md:w-36 lg:w-44 xl:w-52 rounded-md overflow-hidden flex-shrink-0 bg-background/50 flex items-center justify-center">
              <img 
                src={vehicle.thumbnail} 
                alt={vehicle.name} 
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-16 w-20 sm:h-20 sm:w-28 md:h-[88px] md:w-36 lg:w-44 xl:w-52 rounded-md overflow-hidden flex-shrink-0 bg-background/50 flex items-center justify-center">
              <Car className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 xl:h-14 xl:w-14 text-muted-foreground" />
            </div>
          )}
          <div className="flex flex-col justify-between h-16 sm:h-20 md:h-[88px] flex-grow min-w-0 max-w-full overflow-hidden">
            <div className="min-w-0 max-w-full space-y-0.5">
              <h3 className="text-[10px] sm:text-xs font-semibold truncate max-w-full">{vehicle.name}</h3>
              <p className="text-xs text-muted-foreground">{vehicle.brand || 'Brak marki'}</p>
              <p className="text-xs text-muted-foreground">{vehicle.registrationNumber}</p>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          {getStatusIcon()}
        </div>
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
