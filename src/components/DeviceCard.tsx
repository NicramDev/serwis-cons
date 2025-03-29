
import { Smartphone, Check, Clock, AlertTriangle, Car, Edit, Trash2 } from 'lucide-react';
import { Device } from '../utils/types';
import { formatDate } from '../utils/data';
import { Button } from '@/components/ui/button';

interface DeviceCardProps {
  device: Device;
  delay?: number;
  onEdit?: (device: Device) => void;
  onDelete?: (device: Device) => void;
  onViewDetails?: (device: Device) => void;
}

const DeviceCard = ({ device, delay = 0, onEdit, onDelete, onViewDetails }: DeviceCardProps) => {
  const delayClass = `staggered-delay-${delay}`;
  
  const getStatusIcon = () => {
    switch (device.status) {
      case 'ok':
        return <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Check className="h-4 w-4" /></div>;
      case 'needs-service':
        return <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600"><Clock className="h-4 w-4" /></div>;
      case 'in-service':
        return <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Smartphone className="h-4 w-4" /></div>;
      case 'error':
        return <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center text-red-600"><AlertTriangle className="h-4 w-4" /></div>;
      default:
        return null;
    }
  };
  
  return (
    <div className={`glass-card rounded-xl p-3 opacity-0 animate-fade-in ${delayClass} hover:shadow-elevated transition-all w-full`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-secondary text-foreground/70 rounded-full">
            {device.type === 'scanner' ? 'Skaner' : 
             device.type === 'diagnostic' ? 'Diagnostyka' : 
             device.type === 'tablet' ? 'Tablet' : 
             device.type.charAt(0).toUpperCase() + device.type.slice(1)}
          </span>
          <h3 className="text-md font-semibold">{device.name}</h3>
        </div>
        {getStatusIcon()}
      </div>
      
      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Model</span>
          <span className="font-medium">{device.model}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">S/N</span>
          <span className="font-medium">{device.serialNumber}</span>
        </div>
        {device.vehicleId && (
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Pojazd</span>
            <span className="inline-flex items-center">
              <Car className="h-3 w-3 mr-1" />
              #{device.vehicleId.slice(0, 8)}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Serwis</span>
          <span className="font-medium">{formatDate(device.nextService)}</span>
        </div>
      </div>
      
      <div className="flex justify-end mt-3 gap-1">
        <Button 
          variant="secondary"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={() => onViewDetails && onViewDetails(device)}
        >
          Szczegóły
        </Button>
        <Button 
          variant="outline"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={() => onEdit && onEdit(device)}
        >
          <Edit className="h-3 w-3 mr-1" />
          Edytuj
        </Button>
        <Button 
          variant="destructive"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={() => onDelete && onDelete(device)}
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Usuń
        </Button>
      </div>
    </div>
  );
};

export default DeviceCard;
