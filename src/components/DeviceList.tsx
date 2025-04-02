
import React from 'react';
import { Device } from "../utils/types";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

interface DeviceListProps {
  devices: Device[];
  onEditDevice?: (device: Device) => void;
  onDeleteDevice?: (device: Device) => void;
  onViewDevice?: (device: Device) => void;
  onOpenAttachment?: (url: string) => void;
}

const DeviceList = ({ 
  devices, 
  onEditDevice, 
  onDeleteDevice, 
  onViewDevice,
  onOpenAttachment 
}: DeviceListProps) => {
  if (devices.length === 0) {
    return (
      <div className="p-4 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50 text-center">
        <p className="text-sm text-muted-foreground">Brak przypisanych urządzeń do tego pojazdu.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {devices.map((device) => (
        <div 
          key={device.id} 
          className="p-3 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm border border-border/50 hover:shadow-md transition-all"
        >
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              {device.thumbnail ? (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="h-14 w-14 rounded-md overflow-hidden bg-background/50 flex-shrink-0 flex items-center justify-center border border-border/30 cursor-zoom-in relative">
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
                  </HoverCardTrigger>
                  <HoverCardContent className="w-auto p-0">
                    <div className="h-56 w-56 overflow-hidden">
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
                  </HoverCardContent>
                </HoverCard>
              ) : (
                <div className="h-14 w-14 rounded-md overflow-hidden bg-background/50 flex-shrink-0 flex items-center justify-center border border-border/30">
                  <Smartphone className="h-7 w-7 text-muted-foreground" />
                </div>
              )}
              <div>
                <h4 className="font-medium">{device.name}</h4>
                <p className="text-xs text-muted-foreground">{device.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onViewDevice && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 px-2 text-xs"
                  onClick={() => onViewDevice(device)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Podgląd
                </Button>
              )}
              {onEditDevice && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 px-2 text-xs"
                  onClick={() => onEditDevice(device)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edytuj
                </Button>
              )}
              {onDeleteDevice && (
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="h-7 px-2 text-xs"
                  onClick={() => onDeleteDevice(device)}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Usuń
                </Button>
              )}
              {/* Only show badge for statuses other than 'ok' */}
              {device.status !== 'ok' && (
                <Badge variant={
                  device.status === 'needs-service' ? 'secondary' : 
                  device.status === 'in-service' ? 'default' : 
                  'destructive'
                }>
                  {device.status === 'needs-service' ? 'Wymaga serwisu' : 
                  device.status === 'in-service' ? 'W serwisie' : 
                  'Problem'}
                </Badge>
              )}
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-border/50 flex justify-between">
            <span className="text-xs text-muted-foreground">Nr seryjny: {device.serialNumber}</span>
            <span className="text-xs text-muted-foreground">Typ: {device.type}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeviceList;
