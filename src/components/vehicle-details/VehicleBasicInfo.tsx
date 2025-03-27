
import { Vehicle } from '../../utils/types';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Info, MapPin, Tag, Gauge, User } from 'lucide-react';

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

  return (
    <>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{vehicle.name}</h2>
          <p className="text-muted-foreground">{vehicle.brand || 'Brak marki'}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {vehicle.tags && vehicle.tags.split(',').map((tag, index) => (
            <Badge key={index} variant="secondary" className="font-normal shadow-sm">
              {tag.trim()}
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
          <p className="font-medium">{vehicle.purchaseDate ? new Date(vehicle.purchaseDate).toLocaleDateString('pl-PL') : 'Nie podano'}</p>
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
