
import React from 'react';
import { Search, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VehicleSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddVehicle: () => void;
}

const VehicleSearchBar = ({ searchQuery, onSearchChange, onAddVehicle }: VehicleSearchBarProps) => {
  return (
    <div className="mt-6 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Szukaj pojazdów..."
          className="pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 w-full shadow-sm backdrop-blur-sm bg-white/60"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <Button 
        className="flex items-center justify-center space-x-2 shadow-sm"
        onClick={onAddVehicle}
      >
        <PlusCircle className="h-5 w-5" />
        <span>Dodaj Pojazd</span>
      </Button>
    </div>
  );
};

export default VehicleSearchBar;
