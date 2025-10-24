import { Smartphone, Check, Clock, AlertTriangle, Car, Edit, Trash2, Eye, MoveRight } from 'lucide-react';
import { Device } from '../utils/types';
import { formatDate } from '../utils/formatting/dateUtils';
import { Button } from '@/components/ui/button';

interface DeviceCardProps {
  device: Device;
  delay?: number;
  onEdit?: (device: Device) => void;
  onDelete?: (device: Device) => void;
  onViewDetails?: (device: Device) => void;
  actions?: React.ReactNode; // Added actions prop
  onAttachmentClick?: (url: string) => void; // Added onAttachmentClick prop
}

const DeviceCard = ({ 
  device, 
  delay = 0, 
  onEdit, 
  onDelete, 
  onViewDetails, 
  actions, // Added actions prop
  onAttachmentClick 
}: DeviceCardProps) => {
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
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          {device.thumbnail ? (
            <div className="h-20 w-20 rounded-md overflow-hidden flex-shrink-0 bg-background/50 flex items-center justify-center border border-border/30">
              <img 
                src={device.thumbnail} 
                alt={device.name} 
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>
          ) : (
            <div className="h-20 w-20 rounded-md overflow-hidden flex-shrink-0 bg-background/50 flex items-center justify-center border border-border/30">
              <Smartphone className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
          
          <div className="flex flex-col">
            <h3 className="text-md font-semibold mb-2">{device.name}</h3>
            
            <div className="mt-2 space-y-1">
              <div className="grid grid-cols-2 gap-x-4 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Marka urządzenia</span>
                  <span className="font-medium">{device.brand || '-'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Typ urządzenia</span>
                  <span className="font-medium">
                    {device.type === 'scanner' ? 'Skaner' : 
                     device.type === 'diagnostic' ? 'Diagnostyka' : 
                     device.type === 'tablet' ? 'Tablet' : 
                     device.type.charAt(0).toUpperCase() + device.type.slice(1)}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Numer seryjny</span>
                  <span className="font-medium">{device.serialNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Wymagany serwis</span>
                  <span className="font-medium">{formatDate(device.nextService)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {getStatusIcon()}
      </div>
      
      <div className="mt-3">
        {actions ? (
          actions
        ) : (
          <div className="grid grid-cols-3 gap-1">
            <Button 
              variant="secondary"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => onViewDetails && onViewDetails(device)}
            >
              <Eye className="h-3 w-3 mr-1" />
              Podgląd
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => onEdit && onEdit(device)}
            >
              <Edit className="h-3 w-3 mr-1" />
              Edycja
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => {}}
            >
              <MoveRight className="h-3 w-3 mr-1" />
              Przenieś
            </Button>
            <div className="col-start-3">
              <Button 
                variant="destructive"
                size="sm"
                className="h-7 px-2 text-xs w-full"
                onClick={() => onDelete && onDelete(device)}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Usuń
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceCard;
