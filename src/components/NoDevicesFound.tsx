
import React from 'react';
import { Search } from 'lucide-react';

const NoDevicesFound = () => {
  return (
    <div className="backdrop-blur-card rounded-xl p-6 text-center shadow-md border border-border/50">
      <div className="icon-container mx-auto mb-3">
        <Search className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-medium mb-1">Nie znaleziono urządzeń</h3>
      <p className="text-muted-foreground text-sm">
        Żadne urządzenia nie pasują do kryteriów wyszukiwania. Spróbuj innego zapytania lub dodaj nowe urządzenie.
      </p>
    </div>
  );
};

export default NoDevicesFound;
