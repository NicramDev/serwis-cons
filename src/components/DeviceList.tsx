
import React from 'react';
import { Device } from "../utils/types";
import { Badge } from "@/components/ui/badge";

interface DeviceListProps {
  devices: Device[];
}

const DeviceList = ({ devices }: DeviceListProps) => {
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
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">{device.name}</h4>
              <p className="text-xs text-muted-foreground">{device.type}</p>
            </div>
            <Badge variant={
              device.status === 'ok' ? 'outline' : 
              device.status === 'needs-service' ? 'secondary' : 
              device.status === 'in-service' ? 'default' : 
              'destructive'
            }>
              {device.status === 'ok' ? 'Sprawne' : 
              device.status === 'needs-service' ? 'Wymaga serwisu' : 
              device.status === 'in-service' ? 'W serwisie' : 
              'Problem'}
            </Badge>
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
