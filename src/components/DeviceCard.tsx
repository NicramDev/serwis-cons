
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
  
  // Only show the compact card in vehicle list
  if (inVehicleList) {
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
  }
  
  // Original device card for the devices page
  return (
    <div className={`glass-card rounded-xl p-4 md:p-6 ${delayClass} opacity-0 animate-fade-in`}>
      <div className="flex flex-col md:flex-row justify-between">
        <div className="mb-4 md:mb-0">
          <h3 className="text-xl font-bold">{device.name}</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {device.type}
            </Badge>
            {device.model && (
              <Badge variant="outline" className="text-xs">
                Model: {device.model}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              SN: {device.serialNumber}
            </Badge>
            <Badge variant={
              device.status === 'ok' ? 'success' : 
              device.status === 'needs-service' ? 'warning' : 
              device.status === 'in-service' ? 'default' : 
              'destructive'
            }>
              {device.status === 'ok' ? 'Sprawne' : 
               device.status === 'needs-service' ? 'Wymaga serwisu' : 
               device.status === 'in-service' ? 'W serwisie' : 
               'Problem'}
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-2">
          {onViewDetails && (
            <Button variant="outline" size="sm" onClick={onViewDetails}>
              <Eye className="h-4 w-4 mr-1" />
              Szczegóły
            </Button>
          )}
          {onEdit && (
            <Button variant="default" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-1" />
              Edytuj
            </Button>
          )}
          {onDelete && (
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-1" />
              Usuń
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-border/30">
          <p className="text-xs text-muted-foreground mb-1">Ostatni serwis</p>
          <p className="font-medium">{formatDate(device.lastService)}</p>
        </div>
        <div className="p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-border/30">
          <p className="text-xs text-muted-foreground mb-1">Następny serwis</p>
          <p className="font-medium">{formatDate(device.nextService)}</p>
        </div>
      </div>
    </div>
  );
};

export default DeviceCard;
