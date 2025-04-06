import { Vehicle } from '../../utils/types';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Info, MapPin, Gauge, User } from 'lucide-react';
import { formatDate } from '../../utils/formatting/dateUtils';

interface VehicleBasicInfoProps {
  vehicle: Vehicle;
}

const VehicleBasicInfo = ({ vehicle }: VehicleBasicInfoProps) => {
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

  const getStatusClass = () => {
    switch (vehicle.status) {
      case 'ok':
        return "bg-green-100/50 text-green-700 border-green-200";
      case 'needs-service':
        return "bg-orange-100/50 text-orange-700 border-orange-200";
      case 'in-service':
        return "bg-blue-100/50 text-blue-700 border-blue-200";
      default:
        return "bg-red-100/50 text-red-700 border-red-200";
    }
  };

  const getTagColor = (tag: string) => {
    const parts = tag.trim().split(':');
    const tagName = parts[0].trim();
    const tagColor = parts.length > 1 ? parts[1].trim() : null;
    
    if (tagColor) {
      const colorMap: Record<string, string> = {
        blue: "bg-blue-100 text-blue-800 border-blue-200",
        green: "bg-green-100 text-green-800 border-green-200",
        purple: "bg-purple-100 text-purple-800 border-purple-200",
        yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
        pink: "bg-pink-100 text-pink-800 border-pink-200",
        indigo: "bg-indigo-100 text-indigo-800 border-indigo-200",
        red: "bg-red-100 text-red-800 border-red-200",
        orange: "bg-orange-100 text-orange-800 border-orange-200",
        teal: "bg-teal-100 text-teal-800 border-teal-200",
        cyan: "bg-cyan-100 text-cyan-800 border-cyan-200",
        gray: "bg-gray-100 text-gray-800 border-gray-200",
      };
      
      return colorMap[tagColor] || colorMap.blue;
    }
    
    return "bg-blue-100 text-blue-800 border-blue-200";
  };

  const getTagName = (tag: string) => {
    const parts = tag.trim().split(':');
    return parts[0].trim();
  };

  return (
    <>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{vehicle.name}</h2>
          <p className="text-muted-foreground">{vehicle.brand || 'Brak marki'}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {vehicle.tags && vehicle.tags.split(',').map((tag, index) => (
            <Badge 
              key={index} 
              className={`font-normal shadow-sm ${getTagColor(tag)}`}
              variant="outline"
            >
              {getTagName(tag)}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
          <p className="text-sm text-muted-foreground">Numer rejestracyjny</p>
          <p className="font-medium">{vehicle.registrationNumber}</p>
        </div>
        <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
          <p className="text-sm text-muted-foreground">Numer VIN</p>
          <p className="font-medium">{vehicle.vin || 'Nie podano'}</p>
        </div>
        <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
          <p className="text-sm text-muted-foreground">Rok produkcji</p>
          <p className="font-medium">{vehicle.year}</p>
        </div>
        <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
          <p className="text-sm text-muted-foreground">Data zakupu</p>
          <p className="font-medium">{vehicle.purchaseDate ? formatDate(vehicle.purchaseDate) : 'Nie podano'}</p>
        </div>
      </div>

      <Separator className="my-6" />
      
      <div className="space-y-5">
        {vehicle.driverName && (
          <div className="flex items-start space-x-3 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
            <User className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground/80">Kierowca</p>
              <p className="font-medium">{vehicle.driverName}</p>
            </div>
          </div>
        )}
        
        {vehicle.fuelCardNumber && (
          <div className="flex items-start space-x-3 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
            <Gauge className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground/80">Numer karty paliwowej</p>
              <p className="font-medium">{vehicle.fuelCardNumber}</p>
            </div>
          </div>
        )}
        
        {vehicle.gpsSystemNumber && (
          <div className="flex items-start space-x-3 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground/80">Numer systemu GPS</p>
              <p className="font-medium">{vehicle.gpsSystemNumber}</p>
            </div>
          </div>
        )}
        
        {vehicle.notes && (
          <div className="flex items-start space-x-3 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground/80">Notatki</p>
              <p className="text-sm whitespace-pre-line">{vehicle.notes}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VehicleBasicInfo;
