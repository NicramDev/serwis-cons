
import React from 'react';
import { Vehicle } from '../utils/types';

interface VehicleSummaryInfoProps {
  vehicle: Vehicle;
}

const VehicleSummaryInfo = ({ vehicle }: VehicleSummaryInfoProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
        <p className="text-sm text-muted-foreground">Numer rejestracyjny</p>
        <p className="font-medium">{vehicle.registrationNumber}</p>
      </div>
      <div className="space-y-1 p-3 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm border border-border/50">
        <p className="text-sm text-muted-foreground">Następny serwis</p>
        <p className="font-medium">
          {vehicle.serviceExpiryDate ? 
            new Date(vehicle.serviceExpiryDate).toLocaleDateString() : 
            new Date(vehicle.nextService).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default VehicleSummaryInfo;
