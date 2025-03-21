
import { Car, Check, Clock, AlertTriangle, Edit } from 'lucide-react';
import { Vehicle } from '../utils/types';
import { formatDate } from '../utils/data';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface VehicleCardProps {
  vehicle: Vehicle;
  delay?: number;
  onViewDetails: () => void;
  onEdit: () => void;
  isSelected?: boolean;
  onClick: () => void;
}

const VehicleCard = ({ 
  vehicle, 
  delay = 0, 
  onViewDetails, 
  onEdit,
  isSelected = false,
  onClick
}: VehicleCardProps) => {
  const delayClass = `staggered-delay-${delay}`;
  
  const getStatusIcon = () => {
    switch (vehicle.status) {
      case 'ok':
        return <div className="h-10 w-10 rounded-full bg-green-100/70 flex items-center justify-center text-green-600"><Check className="h-5 w-5" /></div>;
      case 'needs-service':
        return <div className="h-10 w-10 rounded-full bg-orange-100/70 flex items-center justify-center text-orange-600"><Clock className="h-5 w-5" /></div>;
      case 'in-service':
        return <div className="h-10 w-10 rounded-full bg-blue-100/70 flex items-center justify-center text-blue-600"><Car className="h-5 w-5" /></div>;
      default:
        return <div className="h-10 w-10 rounded-full bg-red-100/70 flex items-center justify-center text-red-600"><AlertTriangle className="h-5 w-5" /></div>;
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
  
  // Safely access and format dates
  const lastServiceFormatted = formatDate(vehicle.lastService);
  const nextServiceFormatted = formatDate(vehicle.nextService);
  
  return (
    <div 
      className={`rounded-xl p-6 opacity-0 animate-fade-in ${delayClass} hover:shadow-elevated transition-all ${getCardClass()} backdrop-blur-card cursor-pointer w-full`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <Badge variant="secondary" className="text-xs font-medium shadow-sm">
          {vehicle.vehicleType === 'car' ? 'Samochód' : 
           vehicle.vehicleType === 'truck' ? 'Ciężarówka' : 
           vehicle.vehicleType === 'motorcycle' ? 'Motocykl' : 
           'Inny'}
        </Badge>
        <Badge variant={
          vehicle.status === 'ok' ? 'outline' : 
          vehicle.status === 'needs-service' ? 'secondary' : 
          vehicle.status === 'in-service' ? 'default' : 
          'destructive'
        } className="flex items-center gap-1.5 shadow-sm">
          {getStatusText()}
        </Badge>
      </div>
      
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{vehicle.name}</h3>
          <p className="text-muted-foreground">{vehicle.year}</p>
        </div>
        {getStatusIcon()}
      </div>
      
      <div className="mt-5 pt-4 border-t border-border/50 space-y-2.5">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Nr Rejestracyjny</span>
          <span className="text-sm font-medium bg-white/50 px-2 py-0.5 rounded shadow-sm">{vehicle.registrationNumber}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Ostatni Serwis</span>
          <span className="text-sm">{lastServiceFormatted}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Następny Serwis</span>
          <span className="text-sm font-medium">{nextServiceFormatted}</span>
        </div>
      </div>
      
      <div className="flex gap-2 mt-5">
        <Button 
          className="flex-1 gap-2 shadow-sm transition-all hover:shadow-md" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails();
          }}
          variant="outline"
        >
          <Car className="h-4 w-4" />
          Zobacz Szczegóły
        </Button>
        
        <Button 
          className="shadow-sm transition-all hover:shadow-md" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          variant="secondary"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default VehicleCard;
