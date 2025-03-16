
import { Smartphone, Check, Clock, AlertTriangle, Car } from 'lucide-react';
import { Device } from '../utils/types';
import { formatDate } from '../utils/data';

interface DeviceCardProps {
  device: Device;
  delay?: number;
}

const DeviceCard = ({ device, delay = 0 }: DeviceCardProps) => {
  const delayClass = `staggered-delay-${delay}`;
  
  const getStatusIcon = () => {
    switch (device.status) {
      case 'ok':
        return <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Check className="h-5 w-5" /></div>;
      case 'needs-service':
        return <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600"><Clock className="h-5 w-5" /></div>;
      case 'in-service':
        return <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Smartphone className="h-5 w-5" /></div>;
      case 'error':
        return <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600"><AlertTriangle className="h-5 w-5" /></div>;
      default:
        return null;
    }
  };
  
  return (
    <div className={`glass-card rounded-xl p-6 opacity-0 animate-fade-in ${delayClass} hover:shadow-elevated transition-all`}>
      <div className="flex justify-between items-start">
        <span className="inline-block px-2 py-1 text-xs font-medium bg-secondary text-foreground/70 rounded-full">
          {device.type === 'scanner' ? 'Skaner' : 
           device.type === 'diagnostic' ? 'Diagnostyka' : 
           device.type === 'tablet' ? 'Tablet' : 
           device.type.charAt(0).toUpperCase() + device.type.slice(1)}
        </span>
        {getStatusIcon()}
      </div>
      
      <h3 className="text-lg font-semibold mt-4">{device.name}</h3>
      <p className="text-muted-foreground">{device.model}</p>
      
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Numer Seryjny</span>
          <span className="font-medium">{device.serialNumber}</span>
        </div>
        {device.vehicleId && (
          <div className="flex justify-between items-center text-sm mt-2">
            <span className="text-muted-foreground">Przypisane do</span>
            <span className="inline-flex items-center">
              <Car className="h-3 w-3 mr-1" />
              Pojazd #{device.vehicleId}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center text-sm mt-2">
          <span className="text-muted-foreground">Ostatni Serwis</span>
          <span>{formatDate(device.lastService)}</span>
        </div>
        <div className="flex justify-between items-center text-sm mt-2">
          <span className="text-muted-foreground">Następny Serwis</span>
          <span className="font-medium">{formatDate(device.nextService)}</span>
        </div>
      </div>
      
      <button className="w-full mt-4 px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors">
        Zobacz Szczegóły
      </button>
    </div>
  );
};

export default DeviceCard;
