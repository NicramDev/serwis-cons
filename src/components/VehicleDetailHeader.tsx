
import React from 'react';
import { Wrench, Cpu } from 'lucide-react';
import { Vehicle } from '../utils/types';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VehicleDetailHeaderProps {
  vehicle: Vehicle;
  showingServiceRecords: boolean;
  onServiceClick: () => void;
}

const VehicleDetailHeader = ({ 
  vehicle, 
  showingServiceRecords, 
  onServiceClick 
}: VehicleDetailHeaderProps) => {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {vehicle.name}
        </h2>
        <p className="text-muted-foreground">{vehicle.brand || 'Brak marki'}</p>
      </div>
      <div className="flex space-x-2">
        <Tabs 
          defaultValue={showingServiceRecords ? "service" : "devices"} 
          value={showingServiceRecords ? "service" : "devices"}
          className="w-auto"
          onValueChange={(value) => {
            if ((value === "service" && !showingServiceRecords) || 
                (value === "devices" && showingServiceRecords)) {
              onServiceClick();
            }
          }}
        >
          <TabsList className="grid grid-cols-2">
            <TabsTrigger 
              value="service" 
              className={`flex items-center gap-1 ${showingServiceRecords ? 'bg-primary text-primary-foreground' : ''}`}
            >
              <Wrench className="h-4 w-4" />
              Serwis
            </TabsTrigger>
            <TabsTrigger 
              value="devices" 
              className={`flex items-center gap-1 ${!showingServiceRecords ? 'bg-primary text-primary-foreground' : ''}`}
            >
              <Cpu className="h-4 w-4" />
              Urządzenia
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default VehicleDetailHeader;
