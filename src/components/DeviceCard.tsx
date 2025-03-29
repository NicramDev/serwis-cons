
import React from 'react';
import { Device } from '../utils/types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Edit, Trash2, Eye, Info, Check, Clock, AlertTriangle } from 'lucide-react';
import { formatDate } from '../utils/data';

interface DeviceCardProps {
  device: Device;
  delay?: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewDetails?: () => void;
  isSelected?: boolean;
  onClick?: () => void;
  inVehicleList?: boolean;
}

const DeviceCard = ({ 
  device, 
  delay = 0,
  onEdit, 
  onDelete,
  onViewDetails,
  isSelected = false,
  onClick,
  inVehicleList = false
}: DeviceCardProps) => {
  const delayClass = `staggered-delay-${delay}`;
  
  const getStatusIcon = () => {
    switch (device.status) {
      case 'ok':
        return <div className="h-5 w-5 rounded-full bg-green-100/70 flex items-center justify-center text-green-600"><Check className="h-3 w-3" /></div>;
      case 'needs-service':
        return <div className="h-5 w-5 rounded-full bg-orange-100/70 flex items-center justify-center text-orange-600"><Clock className="h-3 w-3" /></div>;
      case 'in-service':
        return <div className="h-5 w-5 rounded-full bg-blue-100/70 flex items-center justify-center text-blue-600"><Info className="h-3 w-3" /></div>;
      default:
        return <div className="h-5 w-5 rounded-full bg-red-100/70 flex items-center justify-center text-red-600"><AlertTriangle className="h-3 w-3" /></div>;
    }
  };
  
  const getCardClass = () => {
    const baseClass = device.status === 'ok' ? 'gradient-card-green border-green-400/30' : 
                     device.status === 'needs-service' ? 'gradient-card-orange border-orange-400/30' : 
                     device.status === 'in-service' ? 'gradient-card-blue border-blue-400/30' : 
                     'gradient-card-red border-red-400/30';
    
    return `${baseClass} ${isSelected ? 'ring-2 ring-primary shadow-lg' : ''}`;
  };
  
  return (
    <div 
      className={`rounded-lg p-3 opacity-0 animate-fade-in ${delayClass} hover:shadow-elevated transition-all ${getCardClass()} backdrop-blur-card cursor-pointer w-full h-auto`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold">{device.name}</h3>
          <p className="text-xs text-muted-foreground">Urządzenie • {device.type}</p>
        </div>
        {getStatusIcon()}
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-muted-foreground">Nr seryjny: {device.serialNumber}</span>
        <div className="flex gap-1">
          {onViewDetails && (
            <Button 
              className="h-6 w-6 p-0" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
              variant="outline"
            >
              <Eye className="h-3 w-3" />
            </Button>
          )}
          
          {onEdit && (
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
          )}
          
          {onDelete && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceCard;
