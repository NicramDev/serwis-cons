
import { Car, Check, Clock, AlertTriangle } from 'lucide-react';
import { Vehicle } from '../utils/types';
import { formatDate } from '../utils/data';

interface VehicleCardProps {
  vehicle: Vehicle;
  delay?: number;
}

const VehicleCard = ({ vehicle, delay = 0 }: VehicleCardProps) => {
  const delayClass = `staggered-delay-${delay}`;
  
  const getStatusIcon = () => {
    switch (vehicle.status) {
      case 'ok':
        return <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Check className="h-5 w-5" /></div>;
      case 'needs-service':
        return <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600"><Clock className="h-5 w-5" /></div>;
      case 'in-service':
        return <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Car className="h-5 w-5" /></div>;
      default:
        return <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600"><AlertTriangle className="h-5 w-5" /></div>;
    }
  };
  
  return (
    <div className={`glass-card rounded-xl p-6 opacity-0 animate-fade-in ${delayClass} hover:shadow-elevated transition-all`}>
      <div className="flex justify-between items-start">
        <span className="inline-block px-2 py-1 text-xs font-medium bg-secondary text-foreground/70 rounded-full">
          {vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}
        </span>
        {getStatusIcon()}
      </div>
      
      <h3 className="text-lg font-semibold mt-4">{vehicle.name}</h3>
      <p className="text-muted-foreground">{vehicle.model} ({vehicle.year})</p>
      
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Reg. Number</span>
          <span className="font-medium">{vehicle.registrationNumber}</span>
        </div>
        <div className="flex justify-between items-center text-sm mt-2">
          <span className="text-muted-foreground">Last Service</span>
          <span>{formatDate(vehicle.lastService)}</span>
        </div>
        <div className="flex justify-between items-center text-sm mt-2">
          <span className="text-muted-foreground">Next Service</span>
          <span className="font-medium">{formatDate(vehicle.nextService)}</span>
        </div>
      </div>
      
      <button className="w-full mt-4 px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors">
        View Details
      </button>
    </div>
  );
};

export default VehicleCard;
