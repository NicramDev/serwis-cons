
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
    <div className={`glass-card rounded-xl p-6 opacity-0 animate-fade-in ${delayClass} hover:shadow-elevated transition-all w-full`}>
      <div className="flex justify-between items-start">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-secondary text-foreground/70 rounded-full">
            {device.type === 'scanner' ? 'Skaner' : 
             device.type === 'diagnostic' ? 'Diagnostyka' : 
             device.type === 'tablet' ? 'Tablet' : 
             device.type.charAt(0).toUpperCase() + device.type.slice(1)}
          </span>
          <h3 className="text-lg font-semibold md:ml-2">{device.name}</h3>
        </div>
        {getStatusIcon()}
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Model</span>
          <span className="font-medium">{device.model}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Numer Seryjny</span>
          <span className="font-medium">{device.serialNumber}</span>
        </div>
        {device.vehicleId && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Przypisane do</span>
            <span className="inline-flex items-center">
              <Car className="h-3 w-3 mr-1" />
              Pojazd #{device.vehicleId}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Następny Serwis</span>
          <span className="font-medium">{formatDate(device.nextService)}</span>
        </div>
      </div>
      
      <div className="flex justify-end mt-4 gap-2">
        <Button 
          variant="secondary"
          size="sm"
          onClick={() => onViewDetails && onViewDetails(device)}
        >
          Szczegóły
        </Button>
        <Button 
          variant="outline"
          size="sm"
          onClick={() => onEdit && onEdit(device)}
        >
          <Edit className="h-4 w-4 mr-1" />
          Edytuj
        </Button>
        <Button 
          variant="destructive"
          size="sm"
          onClick={() => onDelete && onDelete(device)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Usuń
        </Button>
      </div>
    </div>
  );
};

export default DeviceCard;
