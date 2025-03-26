
import React from 'react';
import { Wrench } from 'lucide-react';

const NoVehicleSelected = () => {
  return (
    <div className="h-full flex items-center justify-center p-6 bg-white/50 backdrop-blur-sm border border-border/50 rounded-lg shadow-sm">
      <div className="text-center">
        <div className="icon-container mx-auto mb-4">
          <Wrench className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-medium mb-2">Wybierz pojazd</h3>
        <p className="text-muted-foreground max-w-sm">
          Wybierz pojazd z listy po lewej stronie, aby zobaczyć szczegóły i przypisane urządzenia
        </p>
      </div>
    </div>
  );
};

export default NoVehicleSelected;
