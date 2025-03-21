
import { Car, Check, Clock, AlertTriangle } from 'lucide-react';
import { Vehicle } from '../utils/types';
import { formatDate } from '../utils/data';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface VehicleCardProps {
  vehicle: Vehicle;
  delay?: number;
  onViewDetails: () => void;
}

const VehicleCard = ({ vehicle, delay = 0, onViewDetails }: VehicleCardProps) => {
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
    switch (vehicle.status) {
      case 'ok':
        return 'gradient-card-green border-green-400/30';
      case 'needs-service':
        return 'gradient-card-orange border-orange-400/30';
      case 'in-service':
        return 'gradient-card-blue border-blue-400/30';
      default:
        return 'gradient-card-red border-red-400/30';
    }
  };
  
  // Safely access and format dates
  const lastServiceFormatted = formatDate(vehicle.lastService);
  const nextServiceFormatted = formatDate(vehicle.nextService);
  
  return (
    <div className={`rounded-xl p-6 opacity-0 animate-fade-in ${delayClass} hover:shadow-elevated transition-all ${getCardClass()} backdrop-blur-card`}>
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
      
      <Button 
        className="w-full mt-5 gap-2 shadow-sm transition-all hover:shadow-md" 
        size="sm" 
        onClick={onViewDetails}
        variant="outline"
      >
        <Car className="h-4 w-4" />
        Zobacz Szczegóły
      </Button>
    </div>
  );
};

export default VehicleCard;
