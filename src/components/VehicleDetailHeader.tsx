
import React from 'react';
import { Wrench, Cpu } from 'lucide-react';
import { Vehicle } from '../utils/types';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VehicleDetailHeaderProps {
  vehicle: Vehicle;
  showingServiceRecords?: boolean;
  onServiceClick?: () => void;
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
    </div>
  );
};

export default VehicleDetailHeader;
