
import React from 'react';
import { Search } from 'lucide-react';

const NoVehiclesFound = () => {
  return (
    <div className="backdrop-blur-card rounded-xl p-12 text-center shadow-md border border-border/50">
      <div className="icon-container mx-auto mb-4">
        <Search className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-medium mb-2">Nie znaleziono pojazdów</h3>
      <p className="text-muted-foreground">
        Żadne pojazdy nie pasują do kryteriów wyszukiwania. Spróbuj innego zapytania lub dodaj nowy pojazd.
      </p>
    </div>
  );
};

export default NoVehiclesFound;
